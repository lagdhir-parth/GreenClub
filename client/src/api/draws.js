import api from "./axios";

export const runDraw = () => api.post("/draw/run");

export const getDrawHistory = () => api.get("/draw");
