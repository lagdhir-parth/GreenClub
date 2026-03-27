import supabase from "../config/supabase.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { generateDrawNumbers, countMatches } from "../utils/drawEngine.js";

const runDraw = asyncHandler(async (req, res) => {
  // const drawNumbers = generateDrawNumbers();

  // if (!drawNumbers) {
  //   res.status(500);
  //   throw new ApiError(500, "Failed to generate draw numbers");
  // }

  const drawNumbers = [1, 10, 3, 5, 16]; // for testing

  // 1. Save draw
  const { data: draw } = await supabase
    .from("draws")
    .insert([
      {
        draw_numbers: drawNumbers,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
    ])
    .select()
    .single();

  // 2. Get all users with scores
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id");
  // .eq("subscription_status", "active");

  if (usersError) {
    res.status(500);
    throw new ApiError(500, usersError.message || "Failed to retrieve users");
  }

  let totalWinners = 0;

  for (const user of users) {
    const { data: scores } = await supabase
      .from("scores")
      .select("score")
      .eq("user_id", user.id);

    if (!scores || scores.length === 0) continue;

    const userScores = scores.map((s) => s.score);

    const matches = countMatches(userScores, drawNumbers);

    if (matches >= 3) {
      await supabase.from("winnings").insert([
        {
          user_id: user.id,
          draw_id: draw.id,
          match_count: matches,
          amount: 0, // calculate later
          status: "pending",
        },
      ]);
      totalWinners++;
    }
  }

  res.json({ message: "Draw completed", drawNumbers, totalWinners });
});

export { runDraw };
