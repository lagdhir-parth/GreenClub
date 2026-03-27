import supabase from "../config/supabase.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const addScore = async (req, res) => {
  const userId = req.user.id;
  const { score, date } = req.body || {};

  if (!score || isNaN(score)) {
    res.status(400);
    throw new ApiError(400, "Score is required and must be a number");
  }

  if (score < 1 || score > 45) {
    res.status(400);
    throw new ApiError(400, "Score must be a number between 1 and 45");
  }

  // 1. Get current scores
  const { data: scores, error: scoresError } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", userId)
    .order("played_at", { ascending: true });

  if (scoresError) {
    res.status(500);
    throw new ApiError(500, scoresError.message || "Failed to retrieve scores");
  }

  // 2. If already 5 → delete oldest
  if (scores.length >= 5) {
    const { error: deleteError } = await supabase
      .from("scores")
      .delete()
      .eq("id", scores[0].id);

    if (deleteError) throw new ApiError(500, "Could not rotate scores");
  }

  // 3. Insert new score
  const { data, error } = await supabase
    .from("scores")
    .insert([
      {
        user_id: userId,
        score,
        played_at: date
          ? new Date(date).toISOString()
          : new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    res.status(500);
    throw new ApiError(500, error.message || "Failed to add score");
  }

  res.json(data);
};

export { addScore };
