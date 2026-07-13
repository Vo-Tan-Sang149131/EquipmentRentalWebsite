import { motion } from 'framer-motion';

export default function ProductSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white border rounded-xl overflow-hidden flex flex-col animate-pulse"
    >
      <div className="relative aspect-4/3 bg-gray-200" />
      <div className="p-4 flex flex-col flex-1 space-y-2">
        <div className="h-3 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="h-5 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-20 bg-gray-200 rounded" />
        </div>
      </div>
    </motion.div>
  );
}
