import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Lock, Mail, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import AuthShell from '../components/auth/AuthShell';
import VerificationPanel from '../components/auth/VerificationPanel';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import { AuthDivider, AuthFootnote, AuthInputField } from '../components/auth/AuthPrimitives';

const MINIMUM_PASSWORD_LENGTH = 8;
const googleAuthEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim());

const formReveal = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
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

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const validateRegisterForm = (formData) => {
  if (!formData.name.trim()) {
    return 'Full name is required';
  }

  if (!formData.email.trim()) {
    return 'Email address is required';
  }

  if (formData.password.length < MINIMUM_PASSWORD_LENGTH) {
    return `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters long`;
  }

  if (formData.password !== formData.confirmPassword) {
    return 'Password and confirm password must match';
  }

  return '';
};

const Register = () => {
  const [formData, setFormData] = useState(initialForm);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [devVerificationCode, setDevVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, verifyEmail, resendCode, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const validationMessage = validateRegisterForm(formData);
    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    setLoading(true);

    try {
      const response = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'student',
      });
      setDevVerificationCode(response.devVerificationCode || '');
      toast.success(response.message || 'Verification code sent successfully');
      setVerificationStep(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await verifyEmail(formData.email, verificationCode);
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
      const response = await resendCode(formData.email);
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
      toast.success('Google account connected successfully');
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
      mode="register"
      eyebrow="Student account"
      title="Create account"
      description="Fill the form below to register your student account."
    >
      {verificationStep ? (
        <VerificationPanel
          email={formData.email}
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
          <form onSubmit={handleRegister} className="space-y-4">
            <motion.div variants={formItem}>
              <AuthInputField
                label="Full name"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                icon={<UserRound className="h-5 w-5" />}
              />
            </motion.div>

            <motion.div variants={formItem}>
              <AuthInputField
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                icon={<Mail className="h-5 w-5" />}
              />
            </motion.div>

            <motion.div variants={formItem} className="grid gap-4 sm:grid-cols-2">
              <AuthInputField
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                icon={<Lock className="h-5 w-5" />}
              />

              <AuthInputField
                label="Confirm password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                icon={<Lock className="h-5 w-5" />}
              />
            </motion.div>

            <motion.div variants={formItem}>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
              >
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </motion.div>
          </form>

          <motion.div variants={formItem}>
            <AuthDivider label="or" />
          </motion.div>

          <motion.div variants={formItem}>
            <GoogleAuthButton
              enabled={googleAuthEnabled}
              text="signup_with"
              heading="Sign up with Google"
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </motion.div>

          <motion.div variants={formItem}>
            <AuthFootnote>
              A verification code will be sent to your email.
            </AuthFootnote>
          </motion.div>

          <motion.p variants={formItem} className="text-center text-sm text-slate-600 dark:text-slate-300">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-sky-700 transition hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200"
            >
              Sign in
            </Link>
          </motion.p>
        </motion.div>
      )}
    </AuthShell>
  );
};

export default Register;
