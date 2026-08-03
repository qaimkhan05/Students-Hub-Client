import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/SocialIcons';

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-slate-200/80 bg-white/75 text-slate-600 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/88 dark:text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.7fr_0.8fr] lg:px-8">

        <FooterGroup
          title="Platform"
          links={[
            { label: 'Digital store', to: '/store' },
            { label: 'How it works', to: '/guide' },
            { label: 'Contact support', to: '/contact' },
          ]}
        />

        <div>
          <h4 className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-slate-950 dark:text-white">Contact</h4>
          <div className="space-y-4 text-sm">
            <ContactRow icon={<Mail className="h-4 w-4" />}>
              <a href="mailto:qaim22994@gmail.com" className="transition hover:text-sky-700 dark:hover:text-sky-300">
                qaim22994@gmail.com
              </a>
            </ContactRow>
          </div>
          <div className="mt-5 flex gap-3">
            <SocialLink href="https://github.com/qaimkhan05" label="GitHub" icon={<GithubIcon className="h-4 w-4" />} />
            <SocialLink
              href="https://www.linkedin.com/in/qaim-khan-676511336/"
              label="LinkedIn"
              icon={<LinkedinIcon className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200/80 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400 sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Student Hub Pakistan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const FooterGroup = ({ title, links }) => (
  <div>
    <h4 className="mb-5 text-sm font-black uppercase tracking-[0.22em] text-slate-950 dark:text-white">{title}</h4>
    <div className="grid gap-3 text-sm">
      {links.map((link) => (
        <Link key={link.label} to={link.to} className="transition hover:text-sky-700 dark:hover:text-sky-300">
          {link.label}
        </Link>
      ))}
    </div>
  </div>
);

const ContactRow = ({ icon, children }) => (
  <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
    <span className="rounded-full bg-sky-50 p-2 text-sky-700 dark:bg-white/8 dark:text-sky-300">{icon}</span>
    <span>{children}</span>
  </div>
);

const SocialLink = ({ href, label, icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="rounded-full border border-slate-200 bg-white p-3 text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-300"
  >
    {icon}
  </a>
);

export default Footer;
