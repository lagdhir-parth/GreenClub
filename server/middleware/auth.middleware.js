import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import supabase from "../config/supabase.js";

const verifyUser = asyncHandler(async (req, res, next) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    res.status(401);
    throw new ApiError(401, "Unauthorized: Invalid or missing token");
  }

  req.user = user;
  next();
});

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { data: user, error } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", userId)
    .eq("role", "admin")
    .single();

  if (error) {
    res.status(401);
    throw new ApiError(401, "Unauthorized: Admin access required");
  }

  req.user = user;
  next();
});

export { verifyUser, verifyAdmin };
