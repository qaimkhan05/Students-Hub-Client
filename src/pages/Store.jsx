import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CreditCard, Search, ShieldCheck, ShoppingCart, Sparkles, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/products/ProductCard';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import api, { assetUrl } from '../services/api';
import { formatPrice } from '../utils/format';

const cartItemMotion = {
  initial: { opacity: 0, x: 24, scale: 0.96 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 18, scale: 0.96 },
};

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const deferredSearch = useDeferredValue(searchQuery);
  const { cart, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = ['All', 'Notes', 'Coding Projects', 'Templates'];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.data);
      } catch {
        toast.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = isCartOpen ? 'hidden' : previousOverflow;

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isCartOpen]);

  const filteredProducts = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;

      if (!query) {
        return matchesCategory;
      }

      const searchTarget = [product.title, product.description, product.category]
        .join(' ')
        .toLowerCase();

      return matchesCategory && searchTarget.includes(query);
    });
  }, [category, deferredSearch, products]);

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please login to purchase');
      setIsCartOpen(false);
      navigate('/login');
      return;
    }

    try {
      await api.post('/products/checkout', {
        productIds: cart.map((product) => product._id),
      });
      toast.success('Purchase successful! You can now download your files.');
      clearCart();
      setIsCartOpen(false);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
  };

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-[2.2rem] border border-slate-200 bg-white/85 px-6 py-8 shadow-[0_24px_60px_rgba(15,23,42,0.05)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 dark:shadow-none sm:px-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.08),_transparent_28%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.16),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.08),_transparent_28%)]" />
        <div className="relative space-y-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-[0.72rem] font-black uppercase tracking-[0.22em] text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                <Sparkles className="h-4 w-4" />
                Premium resources
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-[-0.05em] text-slate-950 dark:text-white">Digital marketplace</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  Browse notes, templates, and coding resources designed to help students move faster without sacrificing quality.
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={() => setIsCartOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`relative inline-flex items-center gap-3 rounded-[1.4rem] border px-4 py-3 text-sm font-bold shadow-sm transition ${
                cart.length > 0
                  ? 'animate-cart-glow border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/40 dark:bg-sky-950/40 dark:text-sky-100'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900'
              }`}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-sky-500 dark:text-slate-950">
                <ShoppingCart className="h-5 w-5" />
              </span>
              <span className="text-left">
                <span className="block text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Cart</span>
                <span>{cart.length > 0 ? `${cart.length} item${cart.length > 1 ? 's' : ''}` : 'Ready to fill'}</span>
              </span>
            </motion.button>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
            <div className="flex flex-wrap items-center gap-2 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-2 dark:border-slate-800 dark:bg-slate-900">
              {categories.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    category === item
                      ? 'bg-slate-950 text-white dark:bg-sky-500 dark:text-slate-950'
                      : 'text-slate-600 hover:bg-white hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <label className="relative block min-w-[260px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search notes, templates, projects..."
                  className="w-full rounded-[1.3rem] border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition focus:border-sky-300 focus:bg-sky-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:bg-slate-900"
                />
              </label>

              <div className="inline-flex items-center gap-3 rounded-[1.3rem] border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-950">
                <div className="rounded-2xl bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Results</p>
                  <p className="font-black text-slate-950 dark:text-white">{filteredProducts.length} items</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <div
              key={item}
              className="h-80 animate-pulse rounded-[1.8rem] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
            />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.24, delay: index * 0.03 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.9rem] border border-dashed border-slate-300 bg-white/80 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-950/70"
        >
          <p className="text-lg font-bold text-slate-900 dark:text-white">No products matched this filter.</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Try another category or search term to explore more resources.
          </p>
        </motion.div>
      )}

      <AnimatePresence>
        {isCartOpen ? (
          <div className="fixed inset-0 z-[100] overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              onClick={() => setIsCartOpen(false)}
            />

            <div className="absolute inset-y-0 right-0 flex max-w-full">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className="flex w-screen max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="border-b border-slate-200 p-6 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="flex items-center gap-2 text-xl font-black text-slate-950 dark:text-white">
                        <ShoppingCart className="h-5 w-5" />
                        Your cart
                      </h2>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {cart.length > 0 ? `${cart.length} selected resource${cart.length > 1 ? 's' : ''}` : 'Nothing added yet'}
                      </p>
                    </div>

                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:text-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto p-6">
                  {cart.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-5 rounded-[1.8rem] border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white text-slate-950 shadow-sm dark:bg-slate-950 dark:text-white">
                        <ShoppingCart className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">Your cart is empty.</p>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                          Add a resource to unlock your checkout flow.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsCartOpen(false)}
                        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
                      >
                        Continue shopping
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div layout className="space-y-4">
                      <AnimatePresence initial={false}>
                        {cart.map((item) => (
                          <motion.div
                            key={item._id}
                            layout
                            {...cartItemMotion}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            className="flex gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                          >
                            <img
                              src={assetUrl(item.thumbnailUrl) || '/placeholder.svg'}
                              alt={item.title}
                              className="h-20 w-20 rounded-[1.1rem] object-cover"
                            />
                            <div className="min-w-0 flex-grow">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <h4 className="truncate text-sm font-bold text-slate-950 dark:text-white">{item.title}</h4>
                                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                                    {item.category}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item._id)}
                                  className="rounded-full p-1 text-slate-400 transition hover:text-rose-600"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm font-bold text-sky-700 dark:text-sky-300">{formatPrice(item.price)}</p>
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
                                  Instant access
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </div>

                {cart.length > 0 ? (
                  <div className="space-y-4 border-t border-slate-200 p-6 dark:border-slate-800">
                    <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-500 dark:text-slate-400">
                        <span>Items</span>
                        <span>{cart.length}</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-lg font-black text-slate-950 dark:text-white">
                        <span>Total</span>
                        <span>Rs. {total}</span>
                      </div>
                      <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        Secure digital delivery starts right after checkout confirmation.
                      </p>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-[1.25rem] bg-slate-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
                    >
                      <CreditCard className="h-5 w-5" />
                      Checkout now
                    </button>

                    <button
                      type="button"
                      onClick={clearCart}
                      className="w-full rounded-[1.15rem] border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                    >
                      Clear cart
                    </button>
                  </div>
                ) : null}
              </motion.div>
            </div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Store;
