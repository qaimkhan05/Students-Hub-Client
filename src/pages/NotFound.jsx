import { Link } from 'react-router-dom';
import { ArrowRight, Compass } from 'lucide-react';
import SEO from '../components/common/SEO';

const NotFound = () => (
  <div className="space-y-8 pb-16">
    <SEO title="Page not found" description="The page you are looking for does not exist." />

    <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 px-6 py-16 text-center shadow-[0_24px_70px_rgba(15,23,42,0.07)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-none sm:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.14),_transparent_38%)] dark:bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.22),_transparent_40%)]" />
      <div className="relative">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/25">
          <Compass className="h-9 w-9" />
        </div>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.24em] text-sky-700 dark:text-sky-300">404</p>
        <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl">
          This page wandered off.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          The page you are looking for does not exist or has been moved. Head back to the store or home to keep exploring.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
          >
            Back to home
          </Link>
          <Link
            to="/store"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
          >
            Browse store
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default NotFound;
