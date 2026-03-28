import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUsers, FiTrash2, FiSearch, FiMail } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getAllUsers, deleteUser } from '../../api/admin';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const { data: usersRes, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: getAllUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success('User deleted');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete user'),
  });

  const users = usersRes?.data || [];
  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto w-full py-6 flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold mb-3 text-text-primary"
          >
            User Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-tertiary max-w-2xl"
          >
            View and manage all platform users.
          </motion.p>
        </div>
        <span
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-bg-glass border border-border text-text-secondary shadow-sm shrink-0"
        >
          <FiUsers className="w-5 h-5" />
          {users.length} total users
        </span>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 bg-bg-secondary border border-border text-text-primary"
        />
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-3xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FiUsers}
          title="No users found"
          description={search ? 'Try adjusting your search terms.' : 'No users have signed up yet.'}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {filtered.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-6 p-5 rounded-3xl transition-colors bg-bg-glass border border-border hover:shadow-md"
              >
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-sm">
                  {user.name?.charAt(0)?.toUpperCase() || '?'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold truncate text-text-primary">
                    {user.name}
                  </p>
                  <p className="text-sm flex items-center gap-1.5 truncate text-text-tertiary font-medium">
                    <FiMail className="w-3.5 h-3.5" />
                    {user.email}
                  </p>
                </div>

                {/* Status */}
                <div className="hidden sm:block">
                  <Badge
                    status={
                      user.subscription_end && new Date(user.subscription_end) > new Date()
                        ? 'active'
                        : 'inactive'
                    }
                  >
                    {user.subscription_end && new Date(user.subscription_end) > new Date()
                      ? 'Active'
                      : 'Inactive'}
                  </Badge>
                </div>

                {/* Amount */}
                <div className="hidden md:block text-right w-24">
                  <p className="text-lg font-bold text-text-primary">
                    ₹{user.total_amount_paid?.toLocaleString() || 0}
                  </p>
                  <p className="text-xs text-text-tertiary font-semibold uppercase tracking-wider">paid</p>
                </div>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteId(user.id)}
                  className="text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 shrink-0"
                >
                  <FiTrash2 className="w-5 h-5" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete User"
        size="sm"
      >
        <p className="text-sm mb-6 text-text-secondary">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(deleteId)}
          >
            Delete User
          </Button>
        </div>
      </Modal>
    </div>
  );
}
