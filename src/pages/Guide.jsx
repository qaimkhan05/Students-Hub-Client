import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Download,
  LogIn,
  PlayCircle,
  ShoppingBag,
  UserPlus,
} from 'lucide-react';
import SEO from '../components/common/SEO';
import { Reveal, StaggerItem, StaggerReveal } from '../components/common/Reveal';

const steps = [
  {
    number: '01',
    icon: <UserPlus className="h-6 w-6" />,
    title: 'Create your account',
    description: 'Open the Sign up page and fill in your full name, email, and a strong password. A 6-digit verification code will be sent to your email — enter it to activate your account.',
    action: { label: 'Create account', to: '/register' },
  },
  {
    number: '02',
    icon: <LogIn className="h-6 w-6" />,
    title: 'Sign in to Student Hub',
    description: 'Login with your email and password, or use Continue with Google for one-click access. Make sure you are signed in before adding notes to your cart.',
    action: { label: 'Sign in', to: '/login' },
  },
  {
    number: '03',
    icon: <ShoppingBag className="h-6 w-6" />,
    title: 'Pick a note from the store',
    description: 'Open the Store and browse past papers, notes, and digital resources. Click on any note to see its details before adding it to your cart.',
    action: { label: 'Browse store', to: '/store' },
  },
  {
    number: '04',
    icon: <BookOpen className="h-6 w-6" />,
    title: 'Complete the checkout',
    description: 'Open your cart, review the notes, and complete the checkout. Once the order is marked Completed, the notes are added to your personal library.',
  },
  {
    number: '05',
    icon: <Download className="h-6 w-6" />,
    title: 'Download from your library',
    description: 'Go to your Dashboard and open the Library. Your purchased notes appear there — click Download on any note to save the file to your device.',
    action: { label: 'Open dashboard', to: '/dashboard' },
  },
];

const tips = [
  'Downloads are available anytime — you can re-download your notes again from the library.',
  'Always use a verified account so your purchased notes stay attached to your email.',
  'If a download does not start, check your browser pop-up / download settings and try again.',
  'Need help? Reach out from the Contact page and our team will assist you.',
];

const Guide = () => {
  return (
    <div className="space-y-10 pb-16">
      <SEO
        title="How it works"
        description="Learn how to use Student Hub Pakistan — create an account, pick notes from the store, and download them from your library."
      />

      <Reveal className="relative overflow-hidden rounded-[2.4rem] border border-slate-200 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(14,165,233,0.12),transparent_40%,rgba(16,185,129,0.1)),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:auto,36px_36px,36px_36px] dark:bg-[linear-gradient(120deg,rgba(14,165,233,0.16),transparent_44%,rgba(16,185,129,0.1)),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px)]" />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-[0.72rem] font-black uppercase tracking-[0.22em] text-sky-800 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200">
              <PlayCircle className="h-4 w-4" />
              How it works
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-[-0.06em] text-slate-950 dark:text-white lg:text-6xl">
                Download notes in three simple steps.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Create your account, pick the notes you need from the store, and download them instantly from your library. Here is the full walkthrough.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_rgba(15,23,42,0.18)] transition hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
              >
                <UserPlus className="h-4 w-4" />
                Create account
              </Link>
              <Link
                to="/store"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                <ShoppingBag className="h-4 w-4" />
                Browse store
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Create account & verify email', detail: 'A 6-digit code is sent to your inbox.' },
              { label: 'Pick notes from the store', detail: 'Add them to your cart and check out.' },
              { label: 'Download from the library', detail: 'Your files stay available 24/7.' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-[1.6rem] border border-slate-200 bg-white/92 p-5 shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/88 dark:shadow-none"
              >
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
                <div>
                  <p className="font-bold text-slate-950 dark:text-white">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <div>
        <Reveal className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-700 dark:text-sky-300">Step-by-step guide</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950 dark:text-white">
            How to download a course
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Follow these steps to get your first note from Student Hub.
          </p>
        </Reveal>

        <StaggerReveal className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {steps.map((step) => (
            <StaggerItem key={step.number}>
              <div className="group flex h-full flex-col rounded-[1.8rem] border border-slate-200 bg-white/86 p-7 shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-sky-400/60 group-hover:shadow-[0_28px_60px_rgba(14,165,233,0.15)] dark:border-slate-800 dark:bg-slate-950/84 dark:shadow-none dark:group-hover:border-sky-500/50">
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-black tracking-tight text-slate-400 dark:text-slate-600">{step.number}</span>
                </div>
                <h3 className="mt-6 text-xl font-black tracking-tight text-slate-950 dark:text-white">{step.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-300">{step.description}</p>
                {step.action ? (
                  <Link
                    to={step.action.to}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-700 transition hover:gap-3 dark:text-sky-300"
                  >
                    {step.action.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : null}
              </div>
            </StaggerItem>
          ))}
        </StaggerReveal>
      </div>

      <Reveal className="rounded-[2rem] border border-slate-200 bg-white/86 p-7 shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/84 dark:shadow-none lg:p-9">
        <h3 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Quick tips</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {tips.map((tip) => (
            <div key={tip} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{tip}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="rounded-[2rem] bg-slate-950 p-8 text-center shadow-[0_30px_70px_rgba(15,23,42,0.25)] dark:bg-slate-900 lg:p-10">
        <h2 className="text-3xl font-black tracking-tight text-white lg:text-4xl">Ready to get your notes?</h2>
        <p className="mx-auto mt-3 max-w-xl text-lg leading-8 text-slate-300">
          Create a free account and start downloading past papers and study resources in minutes.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100"
          >
            <UserPlus className="h-4 w-4" />
            Get started
          </Link>
          <Link
            to="/store"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            <ShoppingBag className="h-4 w-4" />
            Go to store
          </Link>
        </div>
      </Reveal>
    </div>
  );
};

export default Guide;
