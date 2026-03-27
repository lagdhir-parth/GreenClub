import supabase from "../config/supabase.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const selectCharity = async (req, res) => {
  const userId = req.user.id;
  const { charity_id, percentage } = req.body || {};

  const { data, error } = await supabase
    .from("users")
    .update({ charity_id, charity_percentage: percentage })
    .eq("id", userId);

  if (error) {
    res.status(400);
    throw new ApiError(400, error.message);
  }

  res.status(200).json(
    new ApiResponse(200, "Charity selection updated", {
      charity_id,
      percentage,
    }),
  );
};

const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  const { data: user, error: dbError } = await supabase
    .from("users")
    .select(
      `
      id,
        email,
        name,
        charity_id,
        charity_percentage,
        `,
    )
    .eq("id", userId)
    .single();

  if (dbError) {
    res.status(400);
    throw new ApiError(400, dbError.message);
  }
  res.status(200).json(new ApiResponse(200, "User profile retrieved", user));
};

export { selectCharity, getUserProfile };
