import api from "./axios";

export const addScore = (data) => api.post("/scores/add-score", data);

export const getMyScores = () => api.get("/scores/my-scores");

export const deleteScore = (id) => api.delete(`/scores/delete-score/${id}`);
