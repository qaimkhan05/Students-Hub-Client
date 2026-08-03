import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

const AuthShell = ({ mode = 'login', eyebrow, title, description, wide = false, children }) => {
  const reduceMotion = useReducedMotion();
  const shellMotion = reduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: {
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
            },
          },
        },
      };
  const cardMotion = reduceMotion
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: 22, scale: 0.98 },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              duration: 0.48,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        },
      };
  const contentMotion = reduceMotion
    ? {}
    : {
        variants: {
          hidden: { opacity: 0, y: 12 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.38,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        },
      };

  return (
    <motion.div
      {...shellMotion}
      className={`mx-auto flex w-full ${wide ? 'max-w-3xl' : 'max-w-xl'} items-center py-6 lg:py-10`}
    >
      <motion.div
        {...cardMotion}
        className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none sm:p-8"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-400 via-emerald-300 to-slate-900 dark:from-sky-300 dark:via-emerald-300 dark:to-white" />
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link to="/" className="text-lg font-semibold text-slate-900 transition hover:text-sky-700 dark:text-white dark:hover:text-sky-300">
            Student Hub Pakistan
          </Link>

          <div className="inline-flex rounded-lg border border-slate-200 p-1 dark:border-slate-800">
            <Link
              to="/login"
              className={`relative overflow-hidden rounded-md px-4 py-2 text-sm font-semibold transition ${
                mode === 'login'
                  ? 'text-white dark:text-slate-950'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {mode === 'login' ? (
                <motion.span
                  layoutId="auth-mode-pill"
                  className="absolute inset-0 rounded-md bg-slate-900 dark:bg-sky-500"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative z-10">Login</span>
            </Link>
            <Link
              to="/register"
              className={`relative overflow-hidden rounded-md px-4 py-2 text-sm font-semibold transition ${
                mode === 'register'
                  ? 'text-white dark:text-slate-950'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              {mode === 'register' ? (
                <motion.span
                  layoutId="auth-mode-pill"
                  className="absolute inset-0 rounded-md bg-slate-900 dark:bg-sky-500"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative z-10">Sign up</span>
            </Link>
          </div>
        </div>

        <motion.div {...contentMotion} className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
        </motion.div>

        <motion.div {...contentMotion}>{children}</motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AuthShell;
