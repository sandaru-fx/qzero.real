import mongoose, { Schema, Model, Document } from 'mongoose';

export interface ISettings extends Document {
  isGlobal: boolean;
  contact: {
    email: string;
    phone: string;
    phoneTel: string;
    whatsapp: string;
    addressLine1: string;
    addressLine2: string;
  };
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
}

const SettingsSchema = new Schema<ISettings>(
  {
    isGlobal: { type: Boolean, default: true, unique: true },
    contact: {
      email: { type: String, default: 'info@qzerointernational.com' },
      phone: { type: String, default: '+94 77 000 0000' },
      phoneTel: { type: String, default: '+94770000000' },
      whatsapp: { type: String, default: '94770000000' },
      addressLine1: { type: String, default: 'No. 123, Marine Drive' },
      addressLine2: { type: String, default: 'Colombo 03, Sri Lanka' },
    },
    social: {
      facebook: { type: String, default: 'https://facebook.com' },
      instagram: { type: String, default: 'https://instagram.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
    },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
