import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Mail,
  MapPin,
  Phone,
  Save,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const buildFormFromUser = (user) => ({
  name: user?.name || '',
  headline: user?.profile?.headline || '',
  bio: user?.profile?.bio || '',
  skills: user?.profile?.skills?.join(', ') || '',
  phone: user?.profile?.phone || '',
  dateOfBirth: user?.profile?.dateOfBirth ? String(user.profile.dateOfBirth).slice(0, 10) : '',
  location: user?.profile?.location || '',
  resumeUrl: user?.profile?.resumeUrl || '',
});

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState(buildFormFromUser(user));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm(buildFormFromUser(user));
  }, [user]);

  const profileScore = useMemo(() => {
    const fields = user?.role === 'admin'
      ? [form.name, form.headline, form.bio, form.location]
      : [form.name, form.headline, form.bio, form.skills, form.resumeUrl, form.phone, form.dateOfBirth, form.location];

    const completed = fields.filter((field) => String(field || '').trim()).length;
    return Math.round((completed / fields.length) * 100);
  }, [form, user?.role]);

  const handleChange = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await updateProfile({
        name: form.name,
        profile: {
          headline: form.headline,
          bio: form.bio,
          skills: form.skills,
          phone: form.phone,
          dateOfBirth: form.dateOfBirth,
          location: form.location,
          resumeUrl: form.resumeUrl,
        },
      });
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-shell space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 px-6 py-7 shadow-[0_24px_70px_rgba(15,23,42,0.07)] backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:shadow-none sm:px-8 lg:px-9">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.18),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.12),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(14,165,233,0.3),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.18),_transparent_35%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-slate-950 text-3xl font-black text-white dark:bg-sky-500 dark:text-slate-950">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="mb-2 inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-sky-800 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200">
                {user?.role} profile
              </div>
              <h1 className="text-3xl font-black text-slate-950 dark:text-white">{user?.name}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                Keep your profile complete so dashboard recommendations, applicant reviews, and account records stay accurate.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:items-end">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
            >
              Back to dashboard <ArrowUpRight className="h-4 w-4" />
            </Link>
            <div className="grid gap-3 sm:grid-cols-2">
              <SummaryPill label="Verification" value={user?.isVerified ? 'Verified' : 'Pending'} />
              <SummaryPill label="Completion" value={`${profileScore}%`} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none sm:p-7">
          <div className="mb-6">
            <div className="mb-3 inline-flex rounded-2xl bg-slate-950 p-3 text-white dark:bg-sky-500 dark:text-slate-950">
              <UserRound className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">Edit profile</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Update the information used across your dashboard, resource access, and account records.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <Field label="Full name" value={form.name} onChange={(value) => handleChange('name', value)} />
            <Field label="Professional headline" value={form.headline} onChange={(value) => handleChange('headline', value)} />
            <Field label="Location" value={form.location} onChange={(value) => handleChange('location', value)} />
            <Field label="Bio" as="textarea" value={form.bio} onChange={(value) => handleChange('bio', value)} />
            {user?.role !== 'admin' ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Mobile number"
                    value={form.phone}
                    onChange={(value) => handleChange('phone', value)}
                    placeholder="+92 300 1234567"
                    type="tel"
                  />
                  <Field
                    label="Date of birth"
                    value={form.dateOfBirth}
                    onChange={(value) => handleChange('dateOfBirth', value)}
                    type="date"
                  />
                </div>
                <Field label="Skills" value={form.skills} onChange={(value) => handleChange('skills', value)} placeholder="React, Node.js, Tailwind CSS" />
                <Field label="Resume URL" value={form.resumeUrl} onChange={(value) => handleChange('resumeUrl', value)} />
              </>
            ) : null}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] bg-slate-950 px-5 py-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </form>
        </section>

        <div className="space-y-8">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none sm:p-7">
            <div className="mb-6">
              <div className="mb-3 inline-flex rounded-2xl bg-slate-950 p-3 text-white dark:bg-sky-500 dark:text-slate-950">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Live preview</h2>
            </div>

            <div className="space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900">
              <PreviewItem icon={<UserRound className="h-4 w-4" />} label="Name" value={form.name || 'Add your name'} />
              <PreviewItem icon={<BadgeCheck className="h-4 w-4" />} label="Headline" value={form.headline || 'Add a headline'} />
              <PreviewItem icon={<MapPin className="h-4 w-4" />} label="Location" value={form.location || 'Add your location'} />
              <PreviewItem icon={<Mail className="h-4 w-4" />} label="Email" value={user?.email || 'No email'} />
              <PreviewItem icon={<Phone className="h-4 w-4" />} label="Phone" value={form.phone || 'Add your mobile number'} />
              <PreviewItem icon={<CalendarDays className="h-4 w-4" />} label="Date of birth" value={form.dateOfBirth || 'Add your date of birth'} />
              <PreviewItem icon={<BadgeCheck className="h-4 w-4" />} label="Skills" value={form.skills || 'Add your core skills'} />
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none sm:p-7">
            <div className="mb-6">
              <div className="mb-3 inline-flex rounded-2xl bg-slate-950 p-3 text-white dark:bg-sky-500 dark:text-slate-950">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-black text-slate-950 dark:text-white">Readiness score</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Completion</p>
                  <p className="text-4xl font-black text-slate-950 dark:text-white">{profileScore}%</p>
                </div>
                <Badge status={profileScore >= 80 ? 'ready' : 'improve'} />
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#0f172a,#0ea5e9)] dark:bg-[linear-gradient(90deg,#38bdf8,#22c55e)]"
                  style={{ width: `${profileScore}%` }}
                />
              </div>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                Complete profiles improve clarity for admins and increase trust across the platform.
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none sm:p-7">
            <div className="mb-5 flex items-start gap-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-sky-500 dark:text-slate-950">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950 dark:text-white">Account status</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">A quick view of your access and identity details.</p>
              </div>
            </div>
            <div className="space-y-3">
              <StatusRow label="Email" value={user?.email || 'Not available'} tone="neutral" />
              <StatusRow label="Role access" value={user?.role || 'Member'} tone="neutral" />
              <StatusRow
                label="Identity check"
                value={user?.isVerified ? 'Verified account' : 'Verification pending'}
                tone={user?.isVerified ? 'success' : 'warning'}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, as = 'input', placeholder = '', type = 'text' }) => (
  <label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</span>
    {as === 'textarea' ? (
      <textarea
        rows="5"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:bg-slate-950"
      />
    ) : (
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[1.25rem] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:bg-slate-950"
      />
    )}
  </label>
);

const PreviewItem = ({ icon, label, value }) => (
  <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-800">
    <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
      {icon}
      {label}
    </p>
    <p className="text-sm font-semibold text-slate-900 dark:text-white">{value}</p>
  </div>
);

const SummaryPill = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm dark:border-slate-800 dark:bg-slate-900">
    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{label}</p>
    <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">{value}</p>
  </div>
);

const StatusRow = ({ label, value, tone = 'neutral' }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-900">
    <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</span>
    <span
      className={`text-right text-sm font-bold ${
        tone === 'success'
          ? 'text-emerald-700 dark:text-emerald-300'
          : tone === 'warning'
            ? 'text-amber-700 dark:text-amber-300'
            : 'text-slate-700 dark:text-slate-200'
      }`}
    >
      {value}
    </span>
  </div>
);

const Badge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] ${
      status === 'ready'
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200'
        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200'
    }`}
  >
    {status === 'ready' ? 'Ready' : 'Needs work'}
  </span>
);

export default Profile;
