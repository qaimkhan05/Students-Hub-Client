import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Lock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import AuthShell from '../components/auth/AuthShell';
import VerificationPanel from '../components/auth/VerificationPanel';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import { AuthDivider, AuthInputField } from '../components/auth/AuthPrimitives';

const googleAuthEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim());

const formReveal = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const formItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');
  const [devVerificationCode, setDevVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, verifyEmail, resendCode, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (err) {
      const payload = err.response?.data;
      if (payload?.notVerified) {
        setVerificationStep(true);
        setVerificationEmail(payload.email || email);
        setDevVerificationCode(payload.devVerificationCode || '');
        toast.error(payload.message || 'Please verify your email first');
      } else {
        toast.error(payload?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await verifyEmail(verificationEmail, verificationCode);
      toast.success('Email verified successfully');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await resendCode(verificationEmail || email);
      setDevVerificationCode(response.devVerificationCode || '');
      toast.success(response.message || 'A fresh code has been sent');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend code');
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) {
      toast.error('Google authentication failed');
      return;
    }

    setLoading(true);

    try {
      await googleLogin(credentialResponse.credential, 'student');
      toast.success('Logged in with Google');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google authentication failed');
  };

  return (
    <AuthShell
      mode="login"
      eyebrow="Student account"
      title="Sign in"
      description="Enter your email and password to continue."
    >
      {verificationStep ? (
        <VerificationPanel
          email={verificationEmail}
          code={verificationCode}
          onCodeChange={setVerificationCode}
          onSubmit={handleVerify}
          onResend={handleResend}
          onBack={() => setVerificationStep(false)}
          loading={loading}
          devCode={devVerificationCode}
          title="Verify your email"
          description="Enter the 6-digit code sent to"
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={formReveal}
          className="space-y-5"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={formItem}>
              <AuthInputField
                label="Email address"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                icon={<Mail className="h-5 w-5" />}
              />
            </motion.div>
            <motion.div variants={formItem}>
              <AuthInputField
                label="Password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                icon={<Lock className="h-5 w-5" />}
              />
            </motion.div>

            <motion.div variants={formItem}>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </motion.div>
          </form>

          <motion.div variants={formItem}>
            <AuthDivider label="or" />
          </motion.div>

          <motion.div variants={formItem}>
            <GoogleAuthButton
              enabled={googleAuthEnabled}
              text="signin_with"
              heading="Sign in with Google"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </motion.div>

          <motion.p variants={formItem} className="text-center text-sm text-slate-600 dark:text-slate-300">
            Need an account?{' '}
            <Link
              to="/register"
              className="font-bold text-sky-700 transition hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
            >
              Sign up
            </Link>
          </motion.p>
        </motion.div>
      )}
    </AuthShell>
  );
};

export default Login;
