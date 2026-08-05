import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

const Home = () => (
  <div className="pb-16">
    <SEO
      title="Home"
      description="Browse digital study resources and manage your Student Hub account in one simple place."
    />

    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
          Study resources in one simple place.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
          Find notes, coding projects, and templates, then manage your purchases from your account.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/store"
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
          >
            Browse store
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            Create account
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Home;
