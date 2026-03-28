import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiHeart, FiCheck, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getCharities } from '../../api/charities';
import { selectCharity } from '../../api/user';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';

export default function CharitySelectionPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [selectedCharity, setSelectedCharity] = useState(user?.charity_id || null);
  const [percentage, setPercentage] = useState(user?.charity_percentage || 10);
  const [saving, setSaving] = useState(false);

  const { data: charitiesRes, isLoading } = useQuery({
    queryKey: ['charities'],
    queryFn: getCharities,
  });

  const charities = charitiesRes?.data || [];

  const handleSave = async () => {
    if (!selectedCharity) {
      toast.error('Please select a charity');
      return;
    }
    if (percentage < 10) {
      toast.error('Minimum contribution is 10%');
      return;
    }

    setSaving(true);
    try {
      await selectCharity({ charity_id: selectedCharity, percentage });
      await refreshUser();
      toast.success('Charity selected!');
      // Navigate to subscription if not subscribed
      if (!user?.subscription_end || new Date(user.subscription_end) < new Date()) {
        navigate('/subscribe');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save selection');
    } finally {
      setSaving(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <div className="max-w-5xl mx-auto w-full py-6 flex flex-col">
      {/* Header */}
      <div className="mb-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold mb-3 text-text-primary"
        >
          Choose Your Charity
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-text-tertiary max-w-2xl mx-auto"
        >
          Every subscription contributes to a cause you care about. Select a charity and set your contribution percentage.
        </motion.p>
      </div>

      {/* Charities Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card-static p-6 border-border flex flex-col h-full rounded-3xl">
              <Skeleton className="w-14 h-14 rounded-2xl mb-5" />
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {charities.map((charity, i) => {
            const isSelected = selectedCharity === charity.id;
            return (
              <motion.div
                key={charity.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                onClick={() => setSelectedCharity(charity.id)}
                className={`
                  relative flex flex-col h-full cursor-pointer rounded-3xl p-6 transition-all duration-300
                  ${isSelected
                    ? 'ring-2 ring-primary-500 shadow-glow border-primary-500 bg-primary-50/50 dark:bg-primary-900/20'
                    : 'hover:shadow-xl border-border hover:bg-surface-50/50 dark:hover:bg-surface-800/50'
                  } border bg-bg-glass backdrop-blur-xl
                `}
              >
                {/* Check mark */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center shadow-md"
                  >
                    <FiCheck className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mb-5 shrink-0 shadow-sm border border-primary-200/50 dark:border-primary-800/50">
                  <FiHeart className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-text-primary">
                  {charity.name}
                </h3>
                <p className="text-sm leading-relaxed text-text-tertiary flex-1">
                  {charity.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Percentage Slider */}
      {selectedCharity && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-static p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                Contribution Percentage
              </h3>
              <p className="text-sm text-text-tertiary">
                Minimum 10% of your subscription goes to charity
              </p>
            </div>
            <div className="text-3xl font-bold text-primary-500">
              {percentage}%
            </div>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${((percentage - 10) / 90) * 100}%, var(--border-color) ${((percentage - 10) / 90) * 100}%, var(--border-color) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs mt-2 text-text-tertiary">
            <span>10%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </motion.div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          loading={saving}
          disabled={!selectedCharity}
          size="lg"
        >
          Continue
          <FiArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
