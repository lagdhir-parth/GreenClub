import supabase from "../config/supabase.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";

const selectCharity = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { charity_id, percentage } = req.body || {};

  if (!charity_id) {
    res.status(400);
    throw new ApiError(400, "Charity ID is required");
  }
  if (
    percentage === undefined ||
    percentage < 0 ||
    percentage > 100 ||
    isNaN(percentage)
  ) {
    res.status(400);
    throw new ApiError(400, "Percentage must be a number between 0 and 100");
  }

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
});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    res.status(400);
    throw new ApiError(400, error.message);
  }

  res.status(200).json(new ApiResponse(200, "User retrieved", user));
});

const subscribeUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { plan_type, amount } = req.body || {};

  if (!plan_type) {
    res.status(400);
    throw new ApiError(400, "Plan type is required");
  }
  if (!amount || isNaN(amount) || amount <= 0) {
    res.status(400);
    throw new ApiError(400, "Amount must be a positive number");
  }

  if (plan_type !== "monthly" && plan_type !== "yearly") {
    res.status(400);
    throw new ApiError(400, "Invalid plan type");
  }

  let sub_end;
  if (plan_type === "monthly") {
    sub_end = new Date();
    sub_end.setMonth(sub_end.getMonth() + 1);
  } else {
    sub_end = new Date();
    sub_end.setFullYear(sub_end.getFullYear() + 1);
  }

  const now = new Date().toISOString();

  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("subscription_end, charity_id")
    .eq("id", userId)
    .single();

  if (fetchError) throw new ApiError(400, fetchError.message);

  if (!existingUser.charity_id) {
    throw new ApiError(400, "Please select a charity first");
  }

  if (
    existingUser.subscription_end &&
    new Date(existingUser.subscription_end) > new Date()
  ) {
    throw new ApiError(400, "User already subscribed");
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      plan_type,
      subscription_end: sub_end.toISOString(),
      subscription_start: now,
      subscription_amount: amount,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    res.status(400);
    throw new ApiError(400, error.message);
  }

  if (!data) {
    res.status(400);
    throw new ApiError(
      400,
      "User is already subscribed or has not selected a charity",
    );
  }

  await supabase.rpc("increment_total_amount_paid", {
    user_id: data.id,
    amount_to_add: amount,
  });

  res.status(200).json(new ApiResponse(200, "Subscribed successfully", data));
});

export { selectCharity, getUserById, subscribeUser };
