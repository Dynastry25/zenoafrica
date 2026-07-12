import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="text-7xl mb-4">🦁</div>
        <h1 className="text-5xl md:text-7xl font-bold mb-4">
          4<span className="zaa-text">0</span>4
        </h1>
        <h2 className="text-2xl font-black mb-3">Lost in the Wilderness</h2>
        <p className="text-secondary max-w-md mx-auto mb-8">
          The page you're looking for has wandered off the trail. Let's get you back to safety.
        </p>
        <Link to="/" className="btn-gold">Return Home</Link>
      </motion.div>
    </div>
  );
}
