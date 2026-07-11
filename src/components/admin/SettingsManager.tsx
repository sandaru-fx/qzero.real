'use client';

import { useState } from 'react';
import { Loader2, Save, Lock, Globe, Phone, Palette } from 'lucide-react';
import { updateSettings, SettingsPayload } from '@/actions/settings';
import { changePassword } from '@/actions/admin';
import { ISettings } from '@/models/Settings';

type TabType = 'brand' | 'contact' | 'security';

export default function SettingsManager({ initialSettings }: { initialSettings: ISettings }) {
  const [activeTab, setActiveTab] = useState<TabType>('contact');
  
  // Settings State
  const [settings, setSettings] = useState<SettingsPayload>({
    contact: initialSettings.contact,
    social: initialSettings.social,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState({ type: '', text: '' });

  // Password State
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  const handleSettingsChange = (section: 'contact' | 'social', field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    setSettingsMessage({ type: '', text: '' });
    
    const res = await updateSettings(settings);
    if (res.success) {
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
    if (passwords.new.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
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

  const inputClasses = "w-full rounded-xl border border-white/10 bg-[#0A0A0A] p-3 text-white outline-none transition-all focus:border-brand-gold focus:ring-1 focus:ring-brand-gold";
  const labelClasses = "mb-2 block text-sm font-medium text-brand-muted";

  return (
    <div className="mt-8">
      {/* Tabs */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-white/5 pb-4">
        <TabButton active={activeTab === 'contact'} onClick={() => setActiveTab('contact')} icon={Globe} label="Contact & Social" />
        <TabButton active={activeTab === 'brand'} onClick={() => setActiveTab('brand')} icon={Palette} label="Brand & UI" />
        <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={Lock} label="Security" />
      </div>

      {/* Tab Content: Contact & Social */}
      {activeTab === 'contact' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Phone className="h-5 w-5 text-brand-gold" />
              Contact Information
            </h2>
            <p className="mt-1 text-sm text-brand-muted mb-6">These details appear in the footer, contact page, and WhatsApp buttons.</p>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Email Address</label>
                <input type="email" value={settings.contact.email} onChange={(e) => handleSettingsChange('contact', 'email', e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Display Phone (e.g. +94 77...)</label>
                <input type="text" value={settings.contact.phone} onChange={(e) => handleSettingsChange('contact', 'phone', e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Callable Phone (e.g. +9477...)</label>
                <input type="text" value={settings.contact.phoneTel} onChange={(e) => handleSettingsChange('contact', 'phoneTel', e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>WhatsApp Number (e.g. 9477...)</label>
                <input type="text" value={settings.contact.whatsapp} onChange={(e) => handleSettingsChange('contact', 'whatsapp', e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Address Line 1</label>
                <input type="text" value={settings.contact.addressLine1} onChange={(e) => handleSettingsChange('contact', 'addressLine1', e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Address Line 2 (City, Country)</label>
                <input type="text" value={settings.contact.addressLine2} onChange={(e) => handleSettingsChange('contact', 'addressLine2', e.target.value)} className={inputClasses} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-brand-gold" />
              Social Media Links
            </h2>
            <p className="mt-1 text-sm text-brand-muted mb-6">Links to your official social media profiles.</p>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className={labelClasses}>Facebook URL</label>
                <input type="url" value={settings.social.facebook} onChange={(e) => handleSettingsChange('social', 'facebook', e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Instagram URL</label>
                <input type="url" value={settings.social.instagram} onChange={(e) => handleSettingsChange('social', 'instagram', e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>YouTube URL</label>
                <input type="url" value={settings.social.youtube} onChange={(e) => handleSettingsChange('social', 'youtube', e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>LinkedIn URL</label>
                <input type="url" value={settings.social.linkedin} onChange={(e) => handleSettingsChange('social', 'linkedin', e.target.value)} className={inputClasses} />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between">
            {settingsMessage.text ? (
              <p className={`text-sm font-medium ${settingsMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                {settingsMessage.text}
              </p>
            ) : <div />}
            <button
              onClick={handleSaveSettings}
              disabled={isSavingSettings}
              className="flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-black gold-gradient transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isSavingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Tab Content: Brand & UI */}
      {activeTab === 'brand' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Palette className="h-5 w-5 text-brand-gold" />
              QZERO Visual Direction
            </h2>
            <p className="mt-1 text-sm text-brand-muted">Core palette used across the showroom and admin panel. (Managed via CSS)</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Swatch label="Jet black" value="#050505" className="bg-[#050505]" />
              <Swatch label="Card black" value="#111111" className="bg-[#111111]" />
              <Swatch label="Brand gold" value="#D4AF37" className="bg-brand-gold" />
            </div>
          </section>
        </div>
      )}

      {/* Tab Content: Security */}
      {activeTab === 'security' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="rounded-2xl border border-white/5 bg-[#111111] p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-brand-gold" />
              Change Password
            </h2>
            <p className="mt-1 text-sm text-brand-muted mb-6">Update your admin account password to maintain security.</p>
            
            <form onSubmit={handleSavePassword} className="max-w-md space-y-5">
              <div>
                <label className={labelClasses}>Current Password</label>
                <input 
                  type="password" 
                  required 
                  value={passwords.current} 
                  onChange={(e) => setPasswords(p => ({ ...p, current: e.target.value }))} 
                  className={inputClasses} 
                />
              </div>
              <div>
                <label className={labelClasses}>New Password</label>
                <input 
                  type="password" 
                  required 
                  value={passwords.new} 
                  onChange={(e) => setPasswords(p => ({ ...p, new: e.target.value }))} 
                  className={inputClasses} 
                />
              </div>
              <div>
                <label className={labelClasses}>Confirm New Password</label>
                <input 
                  type="password" 
                  required 
                  value={passwords.confirm} 
                  onChange={(e) => setPasswords(p => ({ ...p, confirm: e.target.value }))} 
                  className={inputClasses} 
                />
              </div>

              {passwordMessage.text && (
                <div className={`rounded-xl p-3 text-sm font-medium ${passwordMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {passwordMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSavingPassword}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-black gold-gradient transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSavingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                Update Password
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
        active 
          ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]' 
          : 'text-brand-muted hover:bg-white/5 hover:text-white border border-transparent'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function Swatch({ label, value, className }: { label: string; value: string; className: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-[#0A0A0A] p-4">
      <div className={`h-16 rounded-lg border border-white/10 ${className}`} />
      <p className="mt-4 font-semibold text-white">{label}</p>
      <p className="mt-1 text-sm text-brand-muted">{value}</p>
    </div>
  );
}
