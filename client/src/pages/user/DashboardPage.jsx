import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiCreditCard,
  FiTarget,
  FiHeart,
  FiAward,
  FiTrendingUp,
  FiDollarSign,
  FiCalendar,
  FiArrowRight,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getCharities } from "../../api/charities";
import { getMyScores } from "../../api/scores";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Skeleton from "../../components/ui/Skeleton";

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: charitiesRes } = useQuery({
    queryKey: ["charities"],
    queryFn: getCharities,
  });

  const { data: scoresRes } = useQuery({
    queryKey: ["my-scores", user?.id],
    queryFn: getMyScores,
    enabled: !!user?.id,
  });

  const scores = Array.isArray(scoresRes)
    ? scoresRes
    : Array.isArray(scoresRes?.data)
      ? scoresRes.data
      : [];

  const charities = charitiesRes?.data || [];
  const userCharity = charities.find((c) => c.id === user?.charity_id);
  const isActive =
    user?.subscription_end && new Date(user.subscription_end) > new Date();

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // If no charity selected, prompt
  if (!user?.charity_id) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-20 h-20 rounded-2xl bg-primary-50 text-primary-500 dark:bg-primary-900/20 flex items-center justify-center mb-6"
        >
          <FiHeart className="w-10 h-10 text-primary-500" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-2 text-text-primary">
          Choose Your Charity First
        </h2>
        <p className="mb-6 max-w-sm text-text-tertiary">
          Before you can access your dashboard, you need to select a charity to
          support.
        </p>
        <Button onClick={() => navigate("/select-charity")}>
          Select Charity <FiArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="page-container max-w-6xl py-6"
    >
      {/* Welcome */}
      <motion.div variants={itemVariants} className="mb-10">
        <h1 className="text-4xl font-extrabold mb-3 text-text-primary">
          Welcome back, {user?.name?.split(" ")[0] || "Player"} 👋
        </h1>
        <p className="text-lg text-text-tertiary">
          Here&apos;s your membership overview.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        <StatCard
          icon={FiCreditCard}
          label="Subscription"
          value={isActive ? "Active" : "Inactive"}
          color={isActive ? "primary" : "danger"}
        />
        <StatCard
          icon={FiTarget}
          label="My Scores"
          value={`${scores.length} / 5`}
          color="accent"
        />
        <StatCard
          icon={FiDollarSign}
          label="Total Paid"
          value={`₹${user?.total_amount_paid?.toLocaleString() || 0}`}
          color="primary"
        />
        <StatCard
          icon={FiAward}
          label="Total Won"
          value={`₹${user?.total_amount_received?.toLocaleString() || 0}`}
          color="success"
        />
      </motion.div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Card */}
        <motion.div variants={itemVariants}>
          <Card hover={false} className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">
                Subscription Details
              </h3>
              <Badge status={isActive ? "active" : "expired"}>
                {isActive ? "Active" : "Expired"}
              </Badge>
            </div>
            {isActive ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-tertiary">Plan</span>
                  <span className="font-medium capitalize text-text-primary">
                    {user.plan_type}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-tertiary">Started</span>
                  <span className="font-medium text-text-primary">
                    {new Date(user.subscription_start).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-tertiary">Renews</span>
                  <span className="font-medium text-text-primary">
                    {new Date(user.subscription_end).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm mb-3 text-text-tertiary">
                  No active subscription
                </p>
                <Button size="sm" onClick={() => navigate("/subscribe")}>
                  Subscribe Now
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Charity Card */}
        <motion.div variants={itemVariants}>
          <Card hover={false} className="h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text-primary">Your Charity</h3>
              <button
                onClick={() => navigate("/select-charity")}
                className="text-xs text-primary-500 font-semibold hover:text-primary-600 transition-colors cursor-pointer"
              >
                Change
              </button>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                <FiHeart className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-1 text-text-primary">
                  {userCharity?.name || "Selected Charity"}
                </h4>
                <p className="text-xs mb-2 text-text-tertiary">
                  {userCharity?.description || ""}
                </p>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 text-xs font-semibold">
                    {user.charity_percentage}% contribution
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card hover={false}>
            <h3 className="font-semibold mb-4 text-text-primary">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => navigate("/scores")}
                className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer border border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-accent-50 dark:bg-accent-900/20 flex items-center justify-center">
                  <FiTarget className="w-5 h-5 text-accent-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-text-primary">
                    Add Score
                  </p>
                  <p className="text-xs text-text-tertiary">
                    Submit your latest round
                  </p>
                </div>
              </button>
              <button
                onClick={() => navigate("/draws")}
                className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer border border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                  <FiTrendingUp className="w-5 h-5 text-primary-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-text-primary">
                    View Draws
                  </p>
                  <p className="text-xs text-text-tertiary">
                    Check draw results
                  </p>
                </div>
              </button>
              <button
                onClick={() => navigate("/winnings")}
                className="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 hover:bg-surface-100 dark:hover:bg-surface-800 cursor-pointer border border-border"
              >
                <div className="w-10 h-10 rounded-xl bg-success-50 dark:bg-success-900/20 flex items-center justify-center">
                  <FiAward className="w-5 h-5 text-success-500" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-text-primary">
                    Winnings
                  </p>
                  <p className="text-xs text-text-tertiary">View your prizes</p>
                </div>
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
