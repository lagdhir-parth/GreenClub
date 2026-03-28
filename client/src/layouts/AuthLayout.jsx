import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-bg-primary text-text-primary">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500">
        {/* Decorative circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-400/10 blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent-500/10 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 text-center px-12 max-w-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20"
          >
            <FiHeart className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            GreenClub
          </h1>
          <p className="text-primary-100 text-lg leading-relaxed mb-8">
            Play golf. Give back. Win big.
          </p>
          <div className="flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">10K+</p>
              <p className="text-primary-200 text-sm">Members</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">₹50L+</p>
              <p className="text-primary-200 text-sm">Donated</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-primary-200 text-sm">Winners</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 sm:p-16 lg:p-24 overflow-y-auto w-full">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-lg"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
