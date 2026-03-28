import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { getCharities, createCharity, deleteCharity } from '../../api/charities';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';
import EmptyState from '../../components/ui/EmptyState';

export default function CharitiesPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data: charitiesRes, isLoading } = useQuery({
    queryKey: ['charities'],
    queryFn: getCharities,
  });

  const charities = charitiesRes?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const createMutation = useMutation({
    mutationFn: createCharity,
    onSuccess: () => {
      toast.success('Charity created!');
      queryClient.invalidateQueries({ queryKey: ['charities'] });
      reset();
      setShowForm(false);
    },
    onError: (err) => toast.error(err.message || 'Failed to create charity'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCharity,
    onSuccess: () => {
      toast.success('Charity deleted');
      queryClient.invalidateQueries({ queryKey: ['charities'] });
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete charity'),
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

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
            Charity Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-text-tertiary max-w-2xl"
          >
            Create, view, and manage charities available on the platform.
          </motion.p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? 'outline' : 'primary'} size="lg" className="shrink-0">
          <FiPlus className="w-5 h-5" />
          Add Charity
        </Button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <Card hover={false}>
              <h3 className="text-base font-semibold mb-4 text-text-primary">
                New Charity
              </h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Charity Name"
                  placeholder="e.g., Save the Children"
                  error={errors.name?.message}
                  {...register('name', { required: 'Name is required' })}
                />
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-medium text-text-primary">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe the charity's mission..."
                    rows={3}
                    className={`w-full rounded-xl text-sm px-4 py-2.5 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-500/30 resize-none bg-bg-secondary text-text-primary border ${errors.description ? 'border-danger-500' : 'border-border'}`}
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && (
                    <p className="text-xs text-danger-500">{errors.description.message}</p>
                  )}
                </div>
                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="ghost" onClick={() => { setShowForm(false); reset(); }}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={createMutation.isPending}>
                    Create Charity
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Charities List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-3xl" />
          ))}
        </div>
      ) : charities.length === 0 ? (
        <EmptyState
          icon={FiHeart}
          title="No charities yet"
          description="Create your first charity to get started."
          action={
            <Button size="lg" onClick={() => setShowForm(true)}>
              <FiPlus className="w-5 h-5" /> Add Charity
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {charities.map((charity, i) => (
              <motion.div
                key={charity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full flex flex-col p-6 rounded-3xl">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shadow-sm">
                      <FiHeart className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(charity.id)}
                      className="text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 -mr-2 -mt-2"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </Button>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-text-primary">
                    {charity.name}
                  </h3>
                  <p className="text-sm mb-4 leading-relaxed text-text-tertiary flex-1">
                    {charity.description}
                  </p>
                  {charity.total_funds !== undefined && (
                    <div className="flex items-center gap-2 mt-auto">
                      <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 text-xs font-bold border border-primary-100 dark:border-primary-800/30 shadow-sm">
                        ₹{(charity.total_funds || 0).toLocaleString()} raised
                      </span>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Charity"
        size="sm"
      >
        <p className="text-sm mb-6 text-text-secondary">
          Are you sure you want to delete this charity? Users who selected this charity will need to choose a new one.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(deleteId)}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
