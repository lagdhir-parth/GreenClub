import supabase from "../config/supabase.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

// GET /winnings - get all winnings for the logged-in user
const getWinnings = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  // Example fields: id, amount, status, draw_date, created_at
  const { data, error } = await supabase
    .from("winnings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    res.status(500);
    throw new ApiError(500, error.message || "Failed to fetch winnings");
  }
  res.json(new ApiResponse(200, "Winnings fetched", data));
});

export { getWinnings };
