import supabase from "../config/supabase.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const { data } = await supabase.from("users").select("*");
  res.json(data);
});

const createCharity = asyncHandler(async (req, res) => {
  const { name, description } = req.body || {};

  if (!name || !description) {
    res.status(400);
    throw new ApiError(400, "Name and description are required");
  }

  const { data, error } = await supabase
    .from("charities")
    .insert([{ name, description }])
    .select()
    .single();

  if (error) {
    res.status(400);
    throw new ApiError(400, error.message);
  }

  res.status(201).json(new ApiResponse(201, "Charity created", data));
});

export { getAllUsers, createCharity };
