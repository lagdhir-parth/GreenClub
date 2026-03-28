
import api from "./axios";

export const getWinnings = () => api.get("/winnings");
