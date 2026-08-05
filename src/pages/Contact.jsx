import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  MessageSquareText,
  Send,
} from 'lucide-react';
import api from '../services/api';
import SEO from '../components/common/SEO';
import { GithubIcon, LinkedinIcon } from '../components/common/SocialIcons';
import { Reveal, StaggerItem, StaggerReveal } from '../components/common/Reveal';

const initialForm = {
  name: '',
  email: '',
  topic: 'General support',
  message: '',
};

const contactChannels = [
  {
    icon: <Mail className="h-7 w-7" />,
    label: 'Email me',
    detail: 'Click to reveal the email address.',
    href: 'mailto:qaim22994@gmail.com',
    reveal: 'qaim22994@gmail.com',
  },
  {
    icon: <GithubIcon className="h-7 w-7" />,
    label: 'GitHub',
    detail: 'Code, projects, and open source work.',
    href: 'https://github.com/qaimkhan05',
  },
  {
    icon: <LinkedinIcon className="h-7 w-7" />,
    label: 'LinkedIn',
    detail: 'Connect and follow my professional work.',
    href: 'https://www.linkedin.com/in/qaim-khan-676511336/',
  },
  {
    icon: <MapPin className="h-7 w-7" />,
    label: 'Location',
    value: 'Islamabad, Pakistan',
    detail: 'Based in Islamabad, serving students across Pakistan.',
  },
];

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/contact', form);
      toast.success(response.data.message || 'Message sent successfully');
      setForm(initialForm);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send your message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      <SEO
        title="Contact"
        description="Contact Student Hub Pakistan for account help, digital product questions, and platform support."
      />

      <Reveal className="relative overflow-hidden rounded-[2.4rem] border border-slate-200 bg-white/90 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/85 dark:shadow-none lg:p-12">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(14,165,233,0.12),transparent_40%,rgba(16,185,129,0.1)),linear-gradient(90deg,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:auto,36px_36px,36px_36px] dark:bg-[linear-gradient(120deg,rgba(14,165,233,0.16),transparent_44%,rgba(16,185,129,0.1)),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px)]" />
        <div className="relative z-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-sky-50 px-4 py-2 text-[0.72rem] font-black uppercase tracking-[0.22em] text-sky-800 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200">
              <MessageSquareText className="h-4 w-4" />
              Contact support
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-[-0.06em] text-slate-950 dark:text-white lg:text-6xl">
                Talk to the team behind Student Hub.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Reach us for student accounts, digital product access, order support, and platform management questions.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/store"
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
              >
                Visit store
              </Link>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="contact-panel rounded-[2rem] border border-slate-200 bg-white/92 p-5 shadow-[0_24px_60px_rgba(15,23,42,0.07)] dark:border-slate-800 dark:bg-slate-950/88 dark:shadow-none dark:scheme-dark sm:p-6"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <ContactField label="Name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
              <ContactField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
            </div>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Topic</span>
              <select
                name="topic"
                value={form.topic}
                onChange={handleChange}
                className="w-full rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:border-sky-500 dark:[&>option]:bg-slate-900 dark:[&>option]:text-white"
              >
                <option>General support</option>
                <option>Student account</option>
                <option>Digital product order</option>
                <option>Admin operations</option>
              </select>
            </label>
            <label className="mt-4 block">
              <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">Message</span>
              <textarea
                name="message"
                rows="6"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us what you need help with..."
                className="w-full rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500"
              />
            </label>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[1.25rem] bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
            >
              <Send className="h-4 w-4" />
              {loading ? 'Sending...' : 'Send message'}
            </motion.button>
          </form>
        </div>
      </Reveal>

      <StaggerReveal className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {contactChannels.map((channel) => {
          const isRevealed = revealed === channel.label;
          const card = (
            <div className="flex h-full flex-col items-center justify-center gap-4 rounded-[1.8rem] border border-slate-200 bg-white/86 p-8 text-center shadow-[0_20px_50px_rgba(15,23,42,0.05)] backdrop-blur transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-sky-400/60 group-hover:shadow-[0_28px_60px_rgba(14,165,233,0.15)] dark:border-slate-800 dark:bg-slate-950/84 dark:shadow-none dark:group-hover:border-sky-500/50">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-lg shadow-sky-500/25 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                {channel.icon}
              </div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
                {isRevealed && channel.reveal ? 'Email address' : channel.label}
              </p>
              {isRevealed && channel.reveal ? (
                <p className="-mt-2 break-all text-sm font-bold text-sky-700 dark:text-sky-300">{channel.reveal}</p>
              ) : (
                channel.value && <p className="-mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">{channel.value}</p>
              )}
            </div>
          );

          if (channel.reveal) {
            return (
              <StaggerItem key={channel.label}>
                <button
                  type="button"
                  onClick={() => setRevealed((current) => (current === channel.label ? '' : channel.label))}
                  title={channel.detail}
                  aria-label={channel.label}
                  className="group block h-full w-full text-center"
                >
                  {card}
                </button>
              </StaggerItem>
            );
          }

          return (
            <StaggerItem key={channel.label}>
              {channel.href ? (
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={channel.detail}
                  aria-label={channel.label}
                  className="group block h-full"
                >
                  {card}
                </a>
              ) : (
                <div title={channel.detail} className="group block h-full">
                  {card}
                </div>
              )}
            </StaggerItem>
          );
        })}
      </StaggerReveal>
    </div>
  );
};

const ContactField = ({ label, name, value, onChange, type = 'text', placeholder }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-200">{label}</span>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500"
    />
  </label>
);

export default Contact;
