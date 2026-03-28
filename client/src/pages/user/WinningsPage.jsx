import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiAward,
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from "react-icons/fi";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";
import { useAuth } from "../../context/AuthContext";
import { getWinnings } from "../../api/winning";

export default function WinningsPage() {
  const { user } = useAuth();

  const { data: winningsRes, isLoading } = useQuery({
    queryKey: ["winnings"],
    queryFn: getWinnings,
    enabled: !!user?.id,
  });

  const winnings = Array.isArray(winningsRes?.data)
    ? winningsRes.data
    : Array.isArray(winningsRes)
      ? winningsRes
      : [];

  const totalWon = winnings.reduce((sum, w) => sum + (w.amount || 0), 0);

  return (
    <div className="max-w-5xl mx-auto w-full py-6 flex flex-col">
      {/* Header */}
      <div className="mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold mb-3 text-text-primary"
        >
          My Winnings
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-text-tertiary max-w-2xl"
        >
          Track your draw winnings, verification status, and payouts.
        </motion.p>
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card hover={false}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-md">
              <FiDollarSign className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-text-tertiary">Total Winnings</p>
              <p className="text-3xl font-bold text-text-primary">
                ₹{totalWon.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Verification Statuses Explained */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Card hover={false}>
          <h3 className="font-semibold mb-3 text-text-primary">
            Verification Statuses
          </h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Badge status="pending">Pending</Badge>
              <span className="text-xs text-text-tertiary">
                — Awaiting admin review
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge status="approved">Approved</Badge>
              <span className="text-xs text-text-tertiary">
                — Verified by admin
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge status="paid">Paid</Badge>
              <span className="text-xs text-text-tertiary">
                — Payout completed
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Winnings List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card hover={false}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text-primary">
              Winnings History
            </h3>
          </div>
          {isLoading ? (
            <div className="py-8 flex flex-col items-center">
              <FiAward className="w-8 h-8 text-accent-500 mb-2 animate-pulse" />
              <span className="text-sm text-text-tertiary">
                Loading winnings...
              </span>
            </div>
          ) : winnings.length === 0 ? (
            <EmptyState
              icon={FiAward}
              title="No winnings yet"
              description="Win a draw and your prizes will appear here along with verification status."
            />
          ) : (
            <div className="divide-y divide-border">
              {winnings.map((win) => (
                <div
                  key={win.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4 group transition-colors hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl px-2"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-md">
                      <FiAward className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-text-primary truncate">
                          ₹{win.amount_received?.toLocaleString() || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-text-tertiary">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          {win.created_at
                            ? new Date(win.created_at).toLocaleDateString()
                            : "—"}
                        </span>
                        <span className="mx-2">•</span>
                        <span>Draw</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    {win.status === "pending" && (
                      <span className="flex items-center gap-1 text-accent-600 font-medium">
                        <FiClock className="w-4 h-4" /> Pending
                      </span>
                    )}
                    {win.status === "approved" && (
                      <span className="flex items-center gap-1 text-primary-600 font-medium">
                        <FiCheckCircle className="w-4 h-4" /> Approved
                      </span>
                    )}
                    {win.status === "paid" && (
                      <span className="flex items-center gap-1 text-success-600 font-medium">
                        <FiCheckCircle className="w-4 h-4" /> Paid
                      </span>
                    )}
                    {win.status === "expired" && (
                      <span className="flex items-center gap-1 text-danger-500 font-medium">
                        <FiXCircle className="w-4 h-4" /> Expired
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
