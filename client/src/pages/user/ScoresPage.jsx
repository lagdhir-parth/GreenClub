import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { FiTarget, FiPlus, FiCalendar, FiInfo } from "react-icons/fi";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { addScore, getMyScores, deleteScore } from "../../api/scores";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";

import { FiTrash2 } from "react-icons/fi";

export default function ScoresPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [deleteHoverIdx, setDeleteHoverIdx] = useState(null);
  const deleteMutation = useMutation({
    mutationFn: deleteScore,
    onSuccess: () => {
      toast.success("Score deleted!");
      queryClient.invalidateQueries({ queryKey: ["my-scores"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete score");
    },
  });

  const { data: scoresRes, isLoading } = useQuery({
    queryKey: ["my-scores", user?.id],
    queryFn: getMyScores,
    enabled: !!user?.id,
  });

  const scores = Array.isArray(scoresRes)
    ? scoresRes
    : Array.isArray(scoresRes?.data)
      ? scoresRes.data
      : [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const scoreMutation = useMutation({
    mutationFn: addScore,
    onSuccess: () => {
      toast.success("Score added!");
      reset();
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["my-scores"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to add score");
    },
  });

  const onSubmit = (data) => {
    scoreMutation.mutate({
      score: Number(data.score),
      date: data.date || undefined,
    });
  };

  return (
    <div className="max-w-4xl mx-auto w-full py-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold mb-3 text-text-primary"
          >
            My Scores
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-tertiary max-w-xl"
          >
            Manage your golf scores. Only the last 5 scores are kept for draw
            matching.
          </motion.p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? "outline" : "primary"}
          size="lg"
          className="shrink-0"
        >
          <FiPlus className="w-5 h-5" />
          Add Score
        </Button>
      </div>

      {/* Info Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 p-4 rounded-xl mb-6 bg-bg-tertiary border border-border"
      >
        <FiInfo className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
        <div className="text-sm text-text-secondary">
          <p className="font-medium mb-1 text-text-primary">How scores work</p>
          <p>
            Enter your golf score (1–45). Only your{" "}
            <strong>last 5 scores</strong> are stored. When you add a 6th score,
            the oldest one is automatically removed. These scores are matched
            against the monthly draw numbers.
          </p>
        </div>
      </motion.div>

      {/* Add Score Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <Card hover={false}>
              <h3 className="text-base font-semibold mb-4 text-text-primary">
                Add New Score
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Score (1–45)"
                    type="number"
                    icon={FiTarget}
                    placeholder="Enter score"
                    error={errors.score?.message}
                    {...register("score", {
                      required: "Score is required",
                      min: { value: 1, message: "Minimum 1" },
                      max: { value: 45, message: "Maximum 45" },
                    })}
                  />
                  <Input
                    label="Date (optional)"
                    type="date"
                    icon={FiCalendar}
                    error={errors.date?.message}
                    {...register("date")}
                  />
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowForm(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={scoreMutation.isPending}>
                    Save Score
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scores Visual */}
      <Card hover={false}>
        <h3 className="text-base font-semibold mb-4 text-text-primary">
          Your Score Slots
        </h3>
        {isLoading ? (
          <p className="text-sm text-text-tertiary">Loading scores...</p>
        ) : null}

        {!isLoading && scores.length === 0 ? (
          <EmptyState
            title="No scores yet"
            description="Add your first score to fill your draw matching slots."
          />
        ) : null}

        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => {
            const scoreEntry = scores[i];
            const isFilled = !!scoreEntry;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative overflow-hidden cursor-pointer ${
                  isFilled
                    ? "bg-linear-to-br from-primary-600 to-primary-500 group"
                    : "bg-bg-tertiary border border-border"
                }`}
                onMouseEnter={() => isFilled && setDeleteHoverIdx(i)}
                onMouseLeave={() => isFilled && setDeleteHoverIdx(null)}
                onClick={() => {
                  if (
                    isFilled &&
                    deleteHoverIdx === i &&
                    !deleteMutation.isPending
                  ) {
                    deleteMutation.mutate(scoreEntry.id);
                  }
                }}
                tabIndex={isFilled ? 0 : -1}
                aria-label={
                  isFilled ? `Delete score ${scoreEntry.score}` : undefined
                }
              >
                {/* Delete overlay */}
                {isFilled && deleteHoverIdx === i && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-red-600/90 text-white transition-all"
                  >
                    <FiTrash2 className="w-7 h-7 mb-1" />
                    <span className="font-bold text-base">Delete</span>
                  </motion.div>
                )}
                {/* Score content (hidden when deleting) */}
                <span
                  className={`text-2xl font-bold transition-opacity duration-200 ${
                    isFilled && deleteHoverIdx === i
                      ? "opacity-0"
                      : isFilled
                        ? "text-white"
                        : "text-text-tertiary"
                  }`}
                >
                  {isFilled ? scoreEntry.score : "—"}
                </span>
                <span
                  className={`text-[10px] mt-1 font-medium transition-opacity duration-200 ${
                    isFilled && deleteHoverIdx === i
                      ? "opacity-0"
                      : isFilled
                        ? "text-white/80"
                        : "text-text-tertiary"
                  }`}
                >
                  {isFilled
                    ? new Date(scoreEntry.played_at).toLocaleDateString()
                    : `Slot ${i + 1}`}
                </span>
              </motion.div>
            );
          })}
        </div>
        <p className="text-xs mt-4 text-center text-text-tertiary">
          {scores.length} of 5 score slots used
        </p>
      </Card>
    </div>
  );
}
