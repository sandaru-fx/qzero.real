'use client';

import { useState } from 'react';
import { Loader2, Save, Lock, Globe, Phone, Palette, Clock, MapPin, Mail } from 'lucide-react';
import { updateSettings, SettingsPayload } from '@/actions/settings';
import { changePassword, changeAdminEmail } from '@/actions/admin';

type TabType = 'brand' | 'contact' | 'security';
type HourField = 'day' | 'time';

export default function SettingsManager({
  initialSettings,
  initialAdminEmail = '',
}: {
  initialSettings: SettingsPayload;
  initialAdminEmail?: string;
}) {
  const [activeTab, setActiveTab] = useState<TabType>('contact');

  const [settings, setSettings] = useState<SettingsPayload>(initialSettings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState({ type: '', text: '' });

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  const [adminEmail, setAdminEmail] = useState(initialAdminEmail);
  const [emailForm, setEmailForm] = useState({
    currentPassword: '',
    newEmail: '',
    confirmEmail: '',
  });
  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState({ type: '', text: '' });

  const handleSiteChange = (field: keyof SettingsPayload['site'], value: string) => {
    setSettings((prev) => ({
      ...prev,
      site: { ...prev.site, [field]: value },
    }));
  };

  const handleContactChange = (field: keyof SettingsPayload['contact'], value: string) => {
    setSettings((prev) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const handleSocialChange = (field: keyof SettingsPayload['social'], value: string) => {
    setSettings((prev) => ({
      ...prev,
      social: { ...prev.social, [field]: value },
    }));
  };

  const handleHourChange = (index: number, field: HourField, value: string) => {
    setSettings((prev) => {
      const hours = prev.contact.hours.map((h, i) =>
        i === index ? { ...h, [field]: value } : h
      );
      return { ...prev, contact: { ...prev.contact, hours } };
    });
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsMessage({ type: '', text: '' });

    const res = await updateSettings(settings);
    if (res.success) {
      if (res.settings) setSettings(res.settings);
      setSettingsMessage({ type: 'success', text: 'Settings updated successfully!' });
      setTimeout(() => setSettingsMessage({ type: '', text: '' }), 3000);
    } else {
      setSettingsMessage({ type: 'error', text: res.error || 'Failed to update settings.' });
    }
    setIsSavingSettings(false);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (passwords.new.length < 10) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 10 characters.' });
      return;
    }

    setIsSavingPassword(true);
    setPasswordMessage({ type: '', text: '' });

    const res = await changePassword(passwords.current, passwords.new);
    if (res.success) {
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ current: '', new: '', confirm: '' });
      setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
    } else {
      setPasswordMessage({ type: 'error', text: res.error || 'Failed to change password.' });
    }
    setIsSavingPassword(false);
  };

  const handleSaveEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextEmail = emailForm.newEmail.trim().toLowerCase();
    const confirm = emailForm.confirmEmail.trim().toLowerCase();

    if (nextEmail !== confirm) {
      setEmailMessage({ type: 'error', text: 'New emails do not match.' });
      return;
    }

    setIsSavingEmail(true);
    setEmailMessage({ type: '', text: '' });

    const res = await changeAdminEmail(emailForm.currentPassword, nextEmail);
    if (res.success) {
      if (res.email) setAdminEmail(res.email);
      setEmailMessage({ type: 'success', text: 'Admin email updated successfully!' });
      setEmailForm({ currentPassword: '', newEmail: '', confirmEmail: '' });
      setTimeout(() => setEmailMessage({ type: '', text: '' }), 3000);
    } else {
      setEmailMessage({ type: 'error', text: res.error || 'Failed to change email.' });
    }
    setIsSavingEmail(false);
  };

  const inputClasses =
    'w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-3 text-white outline-none transition-all focus:border-brand-gold focus:ring-1 focus:ring-brand-gold';
  const labelClasses = 'mb-2 block text-base font-medium text-brand-muted';

  const saveBar = (
    <div className="flex items-center justify-between">
      {settingsMessage.text ? (
        <p
          className={`text-base font-medium ${
            settingsMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {settingsMessage.text}
        </p>
      ) : (
        <div />
      )}
      <button
        type="button"
        onClick={handleSaveSettings}
        disabled={isSavingSettings}
        className="flex items-center gap-2 rounded-full px-6 py-3 text-base font-bold text-black gold-gradient transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSavingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        Save Changes
      </button>
    </div>
  );

  return (
    <div className="mt-8">
      <div className="mb-8 flex flex-wrap gap-2 border-b border-white/5 pb-4">
        <TabButton
          active={activeTab === 'contact'}
          onClick={() => setActiveTab('contact')}
          icon={Globe}
          label="Contact & Social"
        />
        <TabButton
          active={activeTab === 'brand'}
          onClick={() => setActiveTab('brand')}
          icon={Palette}
          label="Brand & Site"
        />
        <TabButton
          active={activeTab === 'security'}
          onClick={() => setActiveTab('security')}
          icon={Lock}
          label="Security"
        />
      </div>

      {activeTab === 'contact' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
              <Phone className="h-5 w-5 text-brand-gold" />
              Contact Information
            </h2>
            <p className="mb-6 mt-1 text-base text-brand-muted">
              These details appear in the footer, contact page, navbar call button, and WhatsApp
              widgets.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Email Address</label>
                <input
                  type="email"
                  value={settings.contact.email}
                  onChange={(e) => handleContactChange('email', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Display Phone (e.g. +94 712 409 519)</label>
                <input
                  type="text"
                  value={settings.contact.phone}
                  onChange={(e) => handleContactChange('phone', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Callable Phone (e.g. +94712409519)</label>
                <input
                  type="text"
                  value={settings.contact.phoneTel}
                  onChange={(e) => handleContactChange('phoneTel', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>WhatsApp Number (e.g. 94712409519)</label>
                <input
                  type="text"
                  value={settings.contact.whatsapp}
                  onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Address Line 1</label>
                <input
                  type="text"
                  value={settings.contact.addressLine1}
                  onChange={(e) => handleContactChange('addressLine1', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Address Line 2 (City, Country)</label>
                <input
                  type="text"
                  value={settings.contact.addressLine2}
                  onChange={(e) => handleContactChange('addressLine2', e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
              <MapPin className="h-5 w-5 text-brand-gold" />
              Maps & Location
            </h2>
            <p className="mb-6 mt-1 text-base text-brand-muted">
              Used on the contact page map embed and “Get Directions” link.
            </p>
            <div className="grid gap-6">
              <div>
                <label className={labelClasses}>Google Maps Link (opens in new tab)</label>
                <input
                  type="url"
                  value={settings.contact.mapsUrl}
                  onChange={(e) => handleContactChange('mapsUrl', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Google Maps Embed URL</label>
                <input
                  type="url"
                  value={settings.contact.mapsEmbedUrl}
                  onChange={(e) => handleContactChange('mapsEmbedUrl', e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
              <Clock className="h-5 w-5 text-brand-gold" />
              Operating Hours
            </h2>
            <p className="mb-6 mt-1 text-base text-brand-muted">
              Shown on the contact page and footer customer-care strip.
            </p>
            <div className="space-y-4">
              {settings.contact.hours.map((hour, index) => (
                <div key={index} className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClasses}>Day / Range</label>
                    <input
                      type="text"
                      value={hour.day}
                      onChange={(e) => handleHourChange(index, 'day', e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Hours</label>
                    <input
                      type="text"
                      value={hour.time}
                      onChange={(e) => handleHourChange(index, 'time', e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
              <Globe className="h-5 w-5 text-brand-gold" />
              Social Media Links
            </h2>
            <p className="mb-6 mt-1 text-base text-brand-muted">
              Links to your official social media profiles.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Facebook URL</label>
                <input
                  type="url"
                  value={settings.social.facebook}
                  onChange={(e) => handleSocialChange('facebook', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Instagram URL</label>
                <input
                  type="url"
                  value={settings.social.instagram}
                  onChange={(e) => handleSocialChange('instagram', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>YouTube URL</label>
                <input
                  type="url"
                  value={settings.social.youtube}
                  onChange={(e) => handleSocialChange('youtube', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>LinkedIn URL</label>
                <input
                  type="url"
                  value={settings.social.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
          </section>

          {saveBar}
        </div>
      )}

      {activeTab === 'brand' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
              <Palette className="h-5 w-5 text-brand-gold" />
              Site Identity
            </h2>
            <p className="mb-6 mt-1 text-base text-brand-muted">
              Brand name and tagline used across the public site (hero, about, contact, footer).
            </p>
            <div className="grid gap-6">
              <div>
                <label className={labelClasses}>Business Name</label>
                <input
                  type="text"
                  value={settings.site.name}
                  onChange={(e) => handleSiteChange('name', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Tagline</label>
                <input
                  type="text"
                  value={settings.site.tagline}
                  onChange={(e) => handleSiteChange('tagline', e.target.value)}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Website URL</label>
                <input
                  type="url"
                  value={settings.site.url}
                  onChange={(e) => handleSiteChange('url', e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
              <Palette className="h-5 w-5 text-brand-gold" />
              Visual Direction
            </h2>
            <p className="mt-1 text-base text-brand-muted">
              Core palette used across the showroom and admin panel (managed via CSS).
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Swatch label="Jet black" value="#050505" className="bg-[#050505]" />
              <Swatch label="Card black" value="#111111" className="bg-[#111111]" />
              <Swatch label="Brand gold" value="#D4AF37" className="bg-brand-gold" />
            </div>
          </section>

          {saveBar}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
              <Mail className="h-5 w-5 text-brand-gold" />
              Change Login Email
            </h2>
            <p className="mb-2 mt-1 text-base text-brand-muted">
              Update the Gmail / email used to sign in to Admin.
            </p>
            {adminEmail ? (
              <p className="mb-6 text-sm text-white/70">
                Current login email:{' '}
                <span className="font-semibold text-brand-gold">{adminEmail}</span>
              </p>
            ) : (
              <p className="mb-6 text-sm text-white/50">
                Current login email will appear after first sign-in.
              </p>
            )}

            <form
              onSubmit={handleSaveEmail}
              className="max-w-md space-y-5"
              autoComplete="off"
            >
              <div>
                <label className={labelClasses}>Current Password</label>
                <input
                  type="password"
                  required
                  name="verify-password-for-email"
                  autoComplete="new-password"
                  placeholder="Enter current password"
                  value={emailForm.currentPassword}
                  onChange={(e) =>
                    setEmailForm((p) => ({ ...p, currentPassword: e.target.value }))
                  }
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>New Email</label>
                <input
                  type="email"
                  required
                  name="new-admin-email"
                  autoComplete="off"
                  placeholder="you@gmail.com"
                  value={emailForm.newEmail}
                  onChange={(e) => setEmailForm((p) => ({ ...p, newEmail: e.target.value }))}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Confirm New Email</label>
                <input
                  type="email"
                  required
                  name="confirm-admin-email"
                  autoComplete="off"
                  placeholder="you@gmail.com"
                  value={emailForm.confirmEmail}
                  onChange={(e) => setEmailForm((p) => ({ ...p, confirmEmail: e.target.value }))}
                  className={inputClasses}
                />
              </div>

              {emailMessage.text && (
                <div
                  className={`rounded-xl p-3 text-base font-medium ${
                    emailMessage.type === 'success'
                      ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border border-red-500/20 bg-red-500/10 text-red-400'
                  }`}
                >
                  {emailMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingEmail}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-black gold-gradient transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSavingEmail ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4" />
                )}
                Update Email
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-white">
              <Lock className="h-5 w-5 text-brand-gold" />
              Change Password
            </h2>
            <p className="mb-6 mt-1 text-base text-brand-muted">
              Update your admin account password to maintain security.
            </p>

            <form
              onSubmit={handleSavePassword}
              className="max-w-md space-y-5"
              autoComplete="off"
            >
              <div>
                <label className={labelClasses}>Current Password</label>
                <input
                  type="password"
                  required
                  name="current-admin-password"
                  autoComplete="new-password"
                  placeholder="Enter current password"
                  value={passwords.current}
                  onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>New Password</label>
                <input
                  type="password"
                  required
                  name="new-admin-password"
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  value={passwords.new}
                  onChange={(e) => setPasswords((p) => ({ ...p, new: e.target.value }))}
                  className={inputClasses}
                />
              </div>
              <div>
                <label className={labelClasses}>Confirm New Password</label>
                <input
                  type="password"
                  required
                  name="confirm-admin-password"
                  autoComplete="new-password"
                  placeholder="Confirm new password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  className={inputClasses}
                />
              </div>

              {passwordMessage.text && (
                <div
                  className={`rounded-xl p-3 text-base font-medium ${
                    passwordMessage.type === 'success'
                      ? 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
                      : 'border border-red-500/20 bg-red-500/10 text-red-400'
                  }`}
                >
                  {passwordMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingPassword}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-base font-bold text-black gold-gradient transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSavingPassword ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                Update Password
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-medium transition-all duration-300 ${
        active
          ? 'border border-brand-gold/30 bg-brand-gold/10 text-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]'
          : 'border border-transparent text-brand-muted hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function Swatch({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#0A0A0A] p-4">
      <div className={`h-16 rounded-lg border border-white/10 ${className}`} />
      <p className="mt-4 font-semibold text-white">{label}</p>
      <p className="mt-1 text-base text-brand-muted">{value}</p>
    </div>
  );
}
