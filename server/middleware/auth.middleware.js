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
  const { data: user, error } = await supabase.auth.getUser();

  if (error || !user) {
    res.status(401);
    throw new ApiError(401, "Unauthorized: User not found");
  }

  if (!user.role || user.role !== "admin") {
    res.status(403);
    throw new ApiError(403, "Forbidden: Admins only");
  }

  req.user = user;
  next();
});

export { verifyUser, verifyAdmin };
