import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const user = await login(data);
      toast.success('Welcome back!');
      // Redirect based on user state
      if (!user.charity_id) {
        navigate('/select-charity');
      } else if (!user.subscription_end || new Date(user.subscription_end) < new Date()) {
        navigate('/subscribe');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Mobile branding */}
      <div className="lg:hidden text-center mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-1">GreenClub</h1>
        <p className="text-sm text-text-tertiary">
          Play golf. Give back. Win big.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-2"
      >
        <h2 className="text-3xl font-extrabold text-text-primary">
          Welcome back
        </h2>
        <p className="text-base mb-8 text-text-tertiary">
          Sign in to your account to continue
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email"
            type="email"
            icon={FiMail}
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email',
              },
            })}
          />

          <Input
            label="Password"
            type="password"
            icon={FiLock}
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Minimum 6 characters',
              },
            })}
          />

          <Button
            type="submit"
            loading={loading}
            size="lg"
            className="w-full mt-4"
          >
            Sign In
            <FiArrowRight className="w-5 h-5" />
          </Button>
        </form>

        <p className="text-sm text-center mt-6 text-text-tertiary">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
