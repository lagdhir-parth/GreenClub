import supabase from "../config/supabase.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const getCharities = asyncHandler(async (req, res) => {
  const { data, error } = await supabase.from("charities").select("*");

  if (error) {
    res.status(400);
    throw new ApiError(400, error.message);
  }

  res.status(200).json(new ApiResponse(200, "Charities retrieved", data));
});

const deleteCharity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from("charities").delete().eq("id", id);

  if (error) {
    res.status(400);
    throw new ApiError(400, error.message);
  }

  res.status(200).json(new ApiResponse(200, "Charity deleted"));
});

export { getCharities, deleteCharity };
