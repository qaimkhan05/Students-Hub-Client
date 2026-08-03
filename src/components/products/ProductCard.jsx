import { Check, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useCart } from '../../hooks/useCart';
import { assetUrl } from '../../services/api';
import { formatPrice } from '../../utils/format';

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const inCart = cart.some((item) => item._id === product._id);

  const handleAddToCart = () => {
    const success = addToCart(product);
    if (success) {
      toast.success('Added to cart!');
    } else {
      toast.error('Already in cart');
    }
  };

  return (
    <div className="group overflow-hidden rounded-[1.9rem] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_26px_56px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none dark:hover:border-slate-700">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={assetUrl(product.thumbnailUrl) || '/placeholder.svg'}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <span className="rounded-full border border-white/20 bg-white/90 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.18em] text-slate-700 backdrop-blur dark:border-slate-700 dark:bg-slate-950/85 dark:text-slate-200">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="line-clamp-1 font-bold text-slate-950 dark:text-white">{product.title}</h3>
        <p className="mt-2 line-clamp-2 h-12 text-sm leading-6 text-slate-500 dark:text-slate-400">{product.description}</p>

        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-300">{formatPrice(product.price)}</div>
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className={`inline-flex items-center justify-center gap-2 rounded-[1rem] px-4 py-3 text-sm font-bold transition ${
              inCart
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200'
                : 'bg-slate-950 text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400'
            }`}
          >
            {inCart ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
            {inCart ? 'In cart' : 'Add'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
