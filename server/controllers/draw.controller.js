import supabase from "../config/supabase.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { generateDrawNumbers, countMatches } from "../utils/drawEngine.js";

const runDraw = asyncHandler(async (req, res) => {
  const drawNumbers = generateDrawNumbers();
  // const drawNumbers = [10, 20, 30, 40, 45]; // For testing purposes

  if (!drawNumbers) {
    throw new ApiError(500, "Failed to generate draw numbers");
  }

  // 1️⃣ Fetch subscribed users
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id, subscription_amount, charity_id, charity_percentage")
    .gt("subscription_end", new Date().toISOString())
    .not("charity_id", "is", null);

  if (usersError) {
    throw new ApiError(500, usersError.message);
  }

  if (!users || users.length === 0) {
    throw new ApiError(400, "No eligible users for draw");
  }

  // 2️⃣ Calculate pools
  let totalPricePool = 0;
  let totalCharityPool = 0;

  for (const user of users) {
    const charityAmount =
      (user.subscription_amount * (user.charity_percentage || 0)) / 100;

    totalPricePool += user.subscription_amount - charityAmount;
    totalCharityPool += charityAmount;

    const { error: charityError } = await supabase.rpc(
      "increment_charity_funds",
      {
        charity_id: user.charity_id,
        amount_to_add: charityAmount,
      },
    );

    if (charityError) {
      throw new ApiError(500, charityError.message);
    }
  }

  // 3️⃣ Create draw record
  const { data: draw, error: drawError } = await supabase
    .from("draws")
    .insert([
      {
        draw_numbers: drawNumbers,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        total_prize_pool: totalPricePool,
        total_charity_pool: totalCharityPool,
      },
    ])
    .select()
    .single();

  if (drawError) {
    throw new ApiError(500, drawError.message);
  }

  // 4️⃣ Prepare prize tiers
  let userWonArray = [
    {
      matches: 5,
      users: [],
      TotalWinAmount: totalPricePool * 0.4,
    },
    {
      matches: 4,
      users: [],
      TotalWinAmount: totalPricePool * 0.35,
    },
    {
      matches: 3,
      users: [],
      TotalWinAmount: totalPricePool * 0.25,
    },
  ];

  // 5️⃣ Fetch all scores (optimized)
  const { data: allScores, error: scoresError } = await supabase
    .from("scores")
    .select("user_id, score");

  if (scoresError) {
    throw new ApiError(500, scoresError.message);
  }

  // Convert to map → O(n)
  const scoreMap = {};
  for (const s of allScores) {
    if (!scoreMap[s.user_id]) scoreMap[s.user_id] = [];
    scoreMap[s.user_id].push(s.score);
  }

  // =========================
  // ✅ PASS 1: Collect winners
  // =========================
  for (const user of users) {
    const userScores = scoreMap[user.id] || [];
    if (userScores.length === 0) continue;

    const matches = countMatches(userScores, drawNumbers);

    if (matches === 5) userWonArray[0].users.push(user.id);
    else if (matches === 4) userWonArray[1].users.push(user.id);
    else if (matches === 3) userWonArray[2].users.push(user.id);
  }

  // =========================
  // ✅ PASS 2: Calculate payouts
  // =========================
  for (const tier of userWonArray) {
    const winnersCount = tier.users.length;

    if (winnersCount > 0) {
      tier.perUserAmount = tier.TotalWinAmount / winnersCount;
    } else {
      tier.perUserAmount = 0;
    }
  }

  // =========================
  // ✅ PASS 3: Insert winnings
  // =========================
  let totalWinners = 0;

  for (const user of users) {
    const userScores = scoreMap[user.id] || [];
    if (userScores.length === 0) continue;

    const matches = countMatches(userScores, drawNumbers);

    // Reset subscription amount whether they win or not
    const { error: updateError } = await supabase
      .from("users")
      .update({ subscription_amount: 0 })
      .eq("id", user.id);

    if (updateError) {
      throw new ApiError(500, updateError.message);
    }

    if (matches < 3) continue;

    const tier = userWonArray.find((t) => t.matches === matches);
    if (!tier) continue;

    const perUserWinPrice = tier.perUserAmount;

    // Insert winning
    const { error: winError } = await supabase.from("winnings").insert([
      {
        user_id: user.id,
        draw_id: draw.id,
        match_count: matches,
        amount_paid: user.subscription_amount,
        amount_received: perUserWinPrice,
        status: "pending",
      },
    ]);

    if (winError) {
      throw new ApiError(500, winError.message);
    }

    // Update user total received
    const { error: incError } = await supabase.rpc(
      "increment_total_amount_received",
      {
        user_id: user.id,
        amount_to_add: perUserWinPrice,
      },
    );

    if (incError) {
      throw new ApiError(500, incError.message);
    }

    totalWinners++;
  }

  // 6️⃣ Response
  res.status(200).json(
    new ApiResponse(200, "Draw executed successfully", {
      drawNumbers,
      totalWinners,
      prizeDistribution: userWonArray,
    }),
  );
});

const getDrawHistory = asyncHandler(async (req, res) => {
  const { data, error } = await supabase
    .from("draws")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw new ApiError(500, error.message);
  }
  res.json(new ApiResponse(200, "Draw history fetched", data));
});

export { runDraw, getDrawHistory };
