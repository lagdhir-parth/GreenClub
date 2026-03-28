import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiTrendingUp, FiAward, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { runDraw } from '../../api/draws';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';

export default function DrawManagementPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState(null);

  const drawMutation = useMutation({
    mutationFn: runDraw,
    onSuccess: (res) => {
      toast.success('Draw executed successfully!');
      setResult(res.data);
      setShowConfirm(false);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to run draw');
      setShowConfirm(false);
    },
  });

  return (
    <div className="max-w-4xl mx-auto w-full py-6 flex flex-col">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-2">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold mb-1 text-text-primary"
        >
          Draw Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-text-tertiary max-w-2xl"
        >
          Run the monthly prize draw and view results.
        </motion.p>
      </div>

      {/* Run Draw Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <Card hover={false}>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-md">
              <FiPlay className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">
                Execute Monthly Draw
              </h3>
              <p className="text-sm text-text-tertiary">
                Generates 5 random numbers (1-45) and matches against user scores
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 rounded-xl mb-4 bg-bg-tertiary border border-border">
            <FiAlertTriangle className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
            <p className="text-xs text-text-secondary">
              Running a draw will calculate prizes for all eligible users, update charity funds, and reset subscription amounts. This action cannot be undone.
            </p>
          </div>

          <Button
            variant="accent"
            onClick={() => setShowConfirm(true)}
            loading={drawMutation.isPending}
          >
            <FiPlay className="w-4 h-4" />
            Run Draw
          </Button>
        </Card>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Card hover={false}>
              <h3 className="font-semibold mb-4 text-text-primary">
                Draw Results
              </h3>

              {/* Draw Numbers */}
              <div className="mb-6">
                <p className="text-sm mb-3 text-text-tertiary">
                  Winning Numbers
                </p>
                <div className="flex gap-3">
                  {result.drawNumbers?.map((num, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.15, type: 'spring', stiffness: 300 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-lg font-bold shadow-lg"
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Winners Summary */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <FiAward className="w-4 h-4 text-accent-500" />
                  <p className="text-sm font-semibold text-text-primary">
                    Total Winners: {result.totalWinners}
                  </p>
                </div>
              </div>

              {/* Prize Tiers */}
              <div className="space-y-3">
                {result.prizeDistribution?.map((tier) => (
                  <div
                    key={tier.matches}
                    className="flex items-center justify-between p-3 rounded-xl bg-bg-tertiary border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 flex items-center justify-center text-sm font-bold">
                        {tier.matches}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {tier.matches}-Match Prize
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {tier.users?.length || 0} winner{(tier.users?.length || 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-text-primary">
                      ₹{(tier.TotalWinAmount || 0).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Draw Execution"
        size="sm"
      >
        <p className="text-sm mb-6 text-text-secondary">
          This will generate 5 random numbers, match them against all eligible users' scores, calculate and distribute prizes, and update charity funds. Are you sure?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setShowConfirm(false)}>
            Cancel
          </Button>
          <Button
            variant="accent"
            loading={drawMutation.isPending}
            onClick={() => drawMutation.mutate()}
          >
            <FiPlay className="w-4 h-4" />
            Execute Draw
          </Button>
        </div>
      </Modal>
    </div>
  );
}
