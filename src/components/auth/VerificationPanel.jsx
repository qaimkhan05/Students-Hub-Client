import { ArrowLeft, KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';

const VerificationPanel = ({
  email,
  code,
  onCodeChange,
  onSubmit,
  onResend,
  onBack,
  loading,
  devCode,
  title = 'Verify your email',
  description = 'Enter the 6-digit code we sent to continue.',
}) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 transition hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 inline-flex rounded-lg bg-slate-900 p-2 text-white dark:bg-sky-500 dark:text-slate-950">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          {description} <span className="font-semibold text-slate-900 dark:text-white">{email}</span>
        </p>
      </div>

      {devCode ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100">
          <div className="mb-2 flex items-center gap-2 font-semibold">
            <KeyRound className="h-4 w-4" />
            Development code
          </div>
          <p className="font-mono text-base">{devCode}</p>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Verification code</span>
          <input
            type="text"
            maxLength="6"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(event) => onCodeChange(event.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-center font-mono text-2xl tracking-[0.35em] text-slate-950 outline-none transition focus:border-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            required
          />
        </label>

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p className="text-slate-600 dark:text-slate-300">Did not receive the email?</p>
        <button
          type="button"
          onClick={onResend}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:text-slate-900 dark:border-slate-800 dark:text-slate-200 dark:hover:text-white"
        >
          <RefreshCw className="h-4 w-4" />
          Resend code
        </button>
      </div>
    </div>
  );
};

export default VerificationPanel;
