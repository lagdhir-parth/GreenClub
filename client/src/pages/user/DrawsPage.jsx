import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiCalendar,
  FiAward,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { getDrawHistory } from "../../api/draws";

export default function DrawsPage() {
  const { data: drawsRes, isLoading } = useQuery({
    queryKey: ["draw-history"],
    queryFn: getDrawHistory,
  });

  const draws = Array.isArray(drawsRes?.data)
    ? drawsRes.data
    : Array.isArray(drawsRes)
      ? drawsRes
      : [];
  const drawInfo = [
    {
      matches: 5,
      share: "40%",
      description: "All 5 scores match the draw numbers",
      color: "from-accent-500 to-accent-600",
      note: "If no winner, prize rolls over to next month",
    },
    {
      matches: 4,
      share: "35%",
      description: "4 out of 5 scores match",
      color: "from-primary-500 to-primary-600",
      note: "Split equally among all 4-match winners",
    },
    {
      matches: 3,
      share: "25%",
      description: "3 out of 5 scores match",
      color: "from-primary-400 to-primary-500",
      note: "Split equally among all 3-match winners",
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="max-w-5xl mx-auto w-full py-6 flex flex-col">
      {/* Header */}
      <div className="mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold mb-3 text-text-primary"
        >
          Monthly Draws
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-text-tertiary max-w-2xl"
        >
          Understand how the monthly prize draw works and check results.
        </motion.p>
      </div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex gap-3 p-4 rounded-xl mb-6 bg-bg-tertiary border border-border"
      >
        <FiInfo className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
        <div className="text-sm text-text-secondary">
          <p className="font-medium mb-1 text-text-primary">How draws work</p>
          <p>
            Every month, 5 random numbers are drawn (1–45). Your stored scores
            are matched against these numbers. The more matches, the bigger your
            share of the prize pool!
          </p>
        </div>
      </motion.div>

      {/* Prize Tiers */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-lg font-semibold mb-4 text-text-primary">
          Prize Distribution
        </h2>
        <div className="space-y-4 mb-8">
          {drawInfo.map((tier, i) => (
            <motion.div key={tier.matches} variants={itemVariants}>
              <Card hover={false}>
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-linear-to-br ${tier.color} flex items-center justify-center shrink-0 shadow-md`}
                  >
                    <span className="text-xl font-bold text-white">
                      {tier.matches}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-text-primary">
                        {tier.matches}-Match Prize
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 text-xs font-bold">
                        {tier.share} of pool
                      </span>
                    </div>
                    <p className="text-sm mb-1 text-text-secondary">
                      {tier.description}
                    </p>
                    <p className="text-xs italic text-text-tertiary">
                      {tier.note}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Draw Timeline (now with real data) */}
      <Card hover={false}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-primary">Recent Draws</h3>
          <FiCalendar className="w-4 h-4 text-text-tertiary" />
        </div>
        {isLoading ? (
          <div className="py-8 flex flex-col items-center">
            <FiTrendingUp className="w-8 h-8 text-accent-500 mb-2 animate-pulse" />
            <span className="text-sm text-text-tertiary">Loading draws...</span>
          </div>
        ) : draws.length === 0 ? (
          <EmptyState
            icon={FiTrendingUp}
            title="No draw results yet"
            description="Draw results will appear here after each monthly draw is conducted by the admin."
          />
        ) : (
          <div className="max-h-90 divide-y divide-border overflow-y-auto rounded-xl">
            {draws.map((draw) => (
              <div
                key={draw.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4 group transition-colors hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl px-2"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md">
                    <FiAward className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold text-text-primary truncate">
                        {draw.draw_numbers ? draw.draw_numbers.join(", ") : "—"}
                      </span>
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 text-xs font-bold">
                        {draw.total_prize_pool
                          ? `₹${draw.total_prize_pool.toLocaleString()}`
                          : "—"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-tertiary">
                      <FiCalendar className="w-4 h-4" />
                      <span>
                        {draw
                          ? new Date(draw.created_at).toLocaleDateString()
                          : "—"}
                      </span>
                      <span className="mx-2">•</span>
                      <span>Prize Pool</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
