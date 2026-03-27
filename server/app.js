import express from "express";
import supabase from "./config/supabase.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", async (req, res) => {
  const { data, error } = await supabase
    .from("test")
    .select("*")
    .eq("id", 1)
    .single();
  if (error) {
    console.error("Error fetching data from Supabase:", error);
    return res.status(500).json({ error: "Failed to fetch data" });
  }
  res.json(data);
});

import authRoutes from "./routes/auth.routes.js";
import charityRoutes from "./routes/charity.routes.js";
import userRoutes from "./routes/user.routes.js";
import drawRoutes from "./routes/draw.routes.js";
import scoreRoutes from "./routes/score.routes.js";
import adminRoutes from "./routes/admin.routes.js";

app.use("/api/admin", adminRoutes);
app.use("/api/charities", charityRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/scores", scoreRoutes);

export default app;
