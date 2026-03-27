import supabase from "../config/supabase.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const getAllUsers = asyncHandler(async (req, res) => {
  const { data } = await supabase
    .from("users")
    .select("*")
    .neq("role", "admin");

  res.status(200).json(new ApiResponse(200, "Users retrieved", data));
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

const deleteCharity = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("charities")
    .delete()
    .eq("id", id)
    .select();

  if (error || !data || data.length === 0) {
    res.status(404);
    throw new ApiError(404, "Charity not found");
  }

  res.status(200).json(new ApiResponse(200, "Charity deleted"));
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id", id)
    .select();

  if (error || !data || data.length === 0) {
    res.status(404);
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, "User deleted"));
});

export { getAllUsers, createCharity, deleteCharity, deleteUser };
