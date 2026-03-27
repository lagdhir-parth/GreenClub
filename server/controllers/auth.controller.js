import supabase from "../config/supabase.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    res.status(400);
    throw new ApiError(400, "All fields are required");
  }

  // 1️⃣ Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    subscription_status: false, // ✅ Set default subscription status
  });

  if (error) {
    res.status(400);
    throw new ApiError(400, error.message);
  }

  const user = data.user;

  // 2️⃣ Insert into your users table
  const { data: registeredUser, error: dbError } = await supabase
    .from("users")
    .insert([
      {
        id: user.id, // ✅ FIXED
        name,
        email,
      },
    ])
    .select()
    .single();

  if (dbError) {
    res.status(400);
    throw new ApiError(400, dbError.message);
  }

  res.status(200).json(
    new ApiResponse(200, "Registration successful", {
      user: registeredUser,
      token: data.session?.access_token,
      refreshToken: data.session?.refresh_token,
    }),
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  const loggedInUser = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loggedInUser.error) {
    res.status(401);
    throw new ApiError(
      401,
      loggedInUser.error.details || "Invalid email or password",
    );
  }

  return res.status(200).json(
    new ApiResponse(200, "Login successful", {
      user: loggedInUser.data.user,
      token: loggedInUser.data.session.access_token,
      refreshToken: loggedInUser.data.session.refresh_token,
    }),
  );
});

const logout = asyncHandler(async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    res.status(400);
    throw new ApiError(400, error.message);
  }
  res.status(200).json(new ApiResponse(200, "Logout successful"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new ApiError(401, "Unauthorized: No user logged in");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "User retrieved successfully", req.user));
});

export { register, login, logout, getCurrentUser };
