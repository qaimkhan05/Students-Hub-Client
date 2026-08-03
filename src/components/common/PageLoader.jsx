import { motion } from 'framer-motion';

const PageLoader = () => (
  <div className="space-y-6 py-2">
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, repeat: Infinity, repeatType: 'reverse' }}
      className="h-32 rounded-[2rem] border border-slate-200 bg-white/80 shadow-[0_24px_60px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-none"
    />
    <div className="grid gap-6 lg:grid-cols-3">
      {[1, 2, 3].map((item) => (
        <motion.div
          key={item}
          initial={{ opacity: 0.35, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: item * 0.08,
            repeat: Infinity,
            repeatType: 'reverse',
            repeatDelay: 0.4,
          }}
          className="h-44 rounded-[1.75rem] border border-slate-200 bg-white/75 dark:border-slate-800 dark:bg-slate-950/75"
        />
      ))}
    </div>
  </div>
);

export default PageLoader;
