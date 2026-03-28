import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiUsers, FiHeart, FiTrendingUp, FiDollarSign } from "react-icons/fi";
import { getAllUsers } from "../../api/admin";
import { getCharities } from "../../api/charities";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import Skeleton from "../../components/ui/Skeleton";

export default function AdminDashboardPage() {
  const { data: usersRes, isLoading: loadingUsers } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getAllUsers,
  });

  const { data: charitiesRes, isLoading: loadingCharities } = useQuery({
    queryKey: ["charities"],
    queryFn: getCharities,
  });

  const users = usersRes?.data || [];
  const charities = charitiesRes?.data || [];

  const activeUsers = users.filter(
    (u) => u.subscription_end && new Date(u.subscription_end) > new Date(),
  );

  const totalRevenue = users.reduce(
    (sum, u) => sum + (u.total_amount_paid || 0),
    0,
  );
  const totalWinnings = users.reduce(
    (sum, u) => sum + (u.total_amount_received || 0),
    0,
  );
  const totalCharityFunds = charities.reduce(
    (sum, c) => sum + (c.total_funds || 0),
    0,
  );

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loadingUsers || loadingCharities) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-5 w-96 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-text-primary">
          Admin Dashboard
        </h1>
        <p className="text-text-tertiary">Platform overview and key metrics.</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <StatCard
          icon={FiUsers}
          label="Total Users"
          value={users.length}
          color="primary"
        />
        <StatCard
          icon={FiUsers}
          label="Active Subscribers"
          value={activeUsers.length}
          color="success"
        />
        <StatCard
          icon={FiDollarSign}
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          color="accent"
        />
        <StatCard
          icon={FiHeart}
          label="Charity Funds"
          value={`₹${totalCharityFunds.toLocaleString()}`}
          color="primary"
        />
      </motion.div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card hover={false}>
            <h3 className="font-semibold mb-4 text-text-primary">
              Platform Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-text-tertiary">Total Prizes Paid</span>
                <span className="font-semibold text-text-primary">
                  ₹{totalWinnings.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-tertiary">Active Charities</span>
                <span className="font-semibold text-text-primary">
                  {charities.length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-tertiary">Subscription Rate</span>
                <span className="font-semibold text-text-primary">
                  {users.length > 0
                    ? `${Math.round((activeUsers.length / users.length) * 100)}%`
                    : "0%"}
                </span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card hover={false}>
            <h3 className="font-semibold mb-4 text-text-primary">
              Recent Users
            </h3>
            {users.length === 0 ? (
              <p className="text-sm text-text-tertiary">No users yet.</p>
            ) : (
              <div className="space-y-3">
                {users.slice(0, 5).map((u) => {
                  const isActive =
                    u.subscription_end &&
                    new Date(u.subscription_end) > new Date();
                  return (
                    <div key={u.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
                        {u.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate text-text-primary">
                          {u.name}
                        </p>
                        <p className="text-xs truncate text-text-tertiary">
                          {u.email}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          isActive
                            ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                            : "bg-surface-200 text-text-tertiary dark:bg-surface-700"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
