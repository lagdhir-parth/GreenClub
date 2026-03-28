import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiCalendar, FiStar, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { subscribeUser } from '../../api/user';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const plans = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 999,
    period: '/month',
    description: 'Perfect for getting started',
    features: ['Monthly draw entry', 'Score tracking', 'Charity contribution', 'Winner verification'],
    popular: false,
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 9999,
    period: '/year',
    description: 'Best value — save 17%',
    features: ['12 monthly draws', 'Score tracking', 'Charity contribution', 'Winner verification', 'Priority support'],
    popular: true,
  },
];

export default function SubscriptionPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [loading, setLoading] = useState(false);

  const isActive = user?.subscription_end && new Date(user.subscription_end) > new Date();

  const handleSubscribe = async () => {
    if (!user?.charity_id) {
      toast.error('Please select a charity first');
      navigate('/select-charity');
      return;
    }

    const plan = plans.find((p) => p.id === selectedPlan);
    setLoading(true);
    try {
      await subscribeUser({ plan_type: selectedPlan, amount: plan.price });
      await refreshUser();
      toast.success('Subscribed successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container max-w-5xl py-6">
      {/* Header */}
      <div className="mb-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold mb-3 text-text-primary"
        >
          {isActive ? 'Your Subscription' : 'Choose Your Plan'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-text-tertiary max-w-2xl mx-auto"
        >
          {isActive
            ? 'Your subscription details and renewal information.'
            : 'Subscribe to enter monthly draws and support your chosen charity.'}
        </motion.p>
      </div>

      {/* Active subscription info */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-static p-8 mb-10 rounded-3xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <Badge status="active">Active Plan</Badge>
            <span className="text-lg font-bold capitalize text-text-primary">
              {user.plan_type} Subscription
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-bg-tertiary/50 p-6 rounded-2xl border border-border">
            <div className="flex flex-col">
              <span className="text-sm font-medium mb-1 text-text-tertiary">Subscription Start</span>
              <span className="text-base font-bold text-text-primary">
                {user.subscription_start
                  ? new Date(user.subscription_start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium mb-1 text-text-tertiary">Renewal Date</span>
              <span className="text-base font-bold text-text-primary">
                {user.subscription_end
                  ? new Date(user.subscription_end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : '—'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium mb-1 text-text-tertiary">Amount</span>
              <span className="text-base font-bold text-primary-500">
                ₹{user.subscription_amount?.toLocaleString() || 0}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Plan Cards */}
      {!isActive && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {plans.map((plan, i) => {
              const isSelected = selectedPlan === plan.id;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`
                    relative flex flex-col h-full cursor-pointer rounded-3xl p-8 transition-all duration-300 border bg-bg-glass backdrop-blur-xl
                    ${isSelected
                      ? 'ring-2 ring-primary-500 shadow-glow border-primary-500 bg-primary-50/50 dark:bg-primary-900/20'
                      : 'hover:shadow-xl border-border hover:bg-surface-50/50 dark:hover:bg-surface-800/50'
                    }
                  `}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full text-center">
                      <span className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                        <FiStar className="w-3.5 h-3.5" />
                        Most Popular
                      </span>
                    </div>
                  )}

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-5 right-5 w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center shadow-md"
                    >
                      <FiCheck className="w-4 h-4 text-white" />
                    </motion.div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-text-primary">
                      {plan.name}
                    </h3>
                    <p className="text-base text-text-tertiary">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-8">
                    <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-600 to-primary-400">
                      ₹{plan.price.toLocaleString()}
                    </span>
                    <span className="text-base font-medium text-text-tertiary">
                      {plan.period}
                    </span>
                  </div>

                  <ul className="space-y-4 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-base text-text-secondary">
                        <div className="mt-0.5 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0">
                          <FiCheck className="w-3 h-3 text-primary-600 dark:text-primary-400" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSubscribe} loading={loading} size="lg">
              Subscribe Now
              <FiArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
