import { GoogleLogin } from '@react-oauth/google';
import { AlertCircle } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const GoogleAuthButton = ({
  enabled,
  text,
  heading = 'Continue with Google',
  onSuccess,
  onError,
}) => {
  const { isDark } = useTheme();

  if (!enabled) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50/90 px-4 py-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        <div className="mb-3 flex items-center gap-3 font-semibold text-slate-700 dark:text-slate-100">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-950 dark:shadow-none">
            <GoogleMark />
          </span>
          <span>{heading}</span>
        </div>
        <div className="mb-2 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-100">
          <AlertCircle className="h-4 w-4" />
          Google authentication unavailable
        </div>
        <p className="leading-6">
          Add `VITE_GOOGLE_CLIENT_ID` on the client and `GOOGLE_CLIENT_ID` on the server to enable Google login/signup.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-slate-50/85 p-4 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-slate-950 dark:shadow-none">
          <GoogleMark />
        </div>
        <p className="text-sm font-black text-slate-950 dark:text-white">{heading}</p>
      </div>

      <div className="rounded-[1.3rem] border border-slate-200 bg-white px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
        <div className="flex justify-center">
          <GoogleLogin
            key={isDark ? 'google-dark' : 'google-light'}
            onSuccess={onSuccess}
            onError={onError}
            text={text}
            theme={isDark ? 'filled_black' : 'outline'}
            shape="pill"
            size="large"
            logo_alignment="left"
            width="240"
          />
        </div>
      </div>
    </div>
  );
};

const GoogleMark = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
    <path
      fill="#4285F4"
      d="M21.6 12.23c0-.73-.06-1.27-.19-1.84H12v3.48h5.52c-.11.86-.69 2.15-1.98 3.02l-.02.12 2.84 2.2.2.02c1.84-1.7 2.9-4.19 2.9-7Z"
    />
    <path
      fill="#34A853"
      d="M12 22c2.7 0 4.96-.89 6.62-2.41l-3.15-2.44c-.84.59-1.97 1-3.47 1-2.64 0-4.87-1.74-5.67-4.14l-.11.01-2.95 2.29-.04.1C4.88 19.73 8.14 22 12 22Z"
    />
    <path
      fill="#FBBC05"
      d="M6.33 14.01A5.98 5.98 0 0 1 6 12c0-.7.12-1.38.32-2.01l-.01-.13-2.99-2.33-.1.04A9.96 9.96 0 0 0 2 12c0 1.6.38 3.11 1.05 4.43l3.28-2.42Z"
    />
    <path
      fill="#EA4335"
      d="M12 5.84c1.89 0 3.16.81 3.89 1.49l2.84-2.77C16.95 2.91 14.7 2 12 2 8.14 2 4.88 4.27 3.22 7.57l3.1 2.42C7.12 7.58 9.36 5.84 12 5.84Z"
    />
  </svg>
);

export default GoogleAuthButton;
