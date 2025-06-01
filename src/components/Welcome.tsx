import { motion, AnimatePresence } from 'framer-motion';

const Welcome = () => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-800 z-50"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-4"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to
        </motion.h1>
        <motion.h2
          className="text-5xl md:text-7xl font-bold text-yellow-400"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Sri Srinivasa
        </motion.h2>
        <motion.h3
          className="text-3xl md:text-5xl font-bold text-green-400 mt-2"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Fertilizers
        </motion.h3>
      </motion.div>
    </motion.div>
  );
};

export default Welcome; 