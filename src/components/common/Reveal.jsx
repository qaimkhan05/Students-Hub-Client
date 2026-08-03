import { motion, useReducedMotion } from 'framer-motion';

const viewport = { once: true, amount: 0.18 };
const easing = [0.22, 1, 0.36, 1];

export const Reveal = ({
  children,
  className = '',
  delay = 0,
  y = 24,
  duration = 0.55,
}) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration, delay, ease: easing }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerReveal = ({ children, className = '', stagger = 0.12 }) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = '', y = 24, duration = 0.55 }) => {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            ease: easing,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
