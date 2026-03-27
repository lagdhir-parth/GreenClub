import jwt from "jsonwebtoken";
import env from "../config/env.js";
import supabase from "../config/supabase.js";
import ApiError from "./apiError.js";

const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
    },
    env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_EXPIRES_IN,
    },
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
    },
  );

  const { data, error } = await supabase
    .from("users")
    .update({ refresh_token: refreshToken })
    .eq("id", user.id);

  if (error) {
    throw new ApiError(500, "Failed to store refresh token");
  }

  return { accessToken, refreshToken };
};

export default generateTokens;
