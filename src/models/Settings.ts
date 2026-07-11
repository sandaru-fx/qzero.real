import mongoose, { Schema, Model, Document } from 'mongoose';

export type OperatingHour = {
  day: string;
  time: string;
};

export interface ISettings extends Document {
  isGlobal: boolean;
  site: {
    name: string;
    tagline: string;
    url: string;
  };
  contact: {
    email: string;
    phone: string;
    phoneTel: string;
    whatsapp: string;
    addressLine1: string;
    addressLine2: string;
    mapsUrl: string;
    mapsEmbedUrl: string;
    hours: OperatingHour[];
  };
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
}

const HourSchema = new Schema<OperatingHour>(
  {
    day: { type: String, required: true },
    time: { type: String, required: true },
  },
  { _id: false }
);

const SettingsSchema = new Schema<ISettings>(
  {
    isGlobal: { type: Boolean, default: true, unique: true },
    site: {
      name: { type: String, default: 'QZERO International' },
      tagline: {
        type: String,
        default: 'Premium Automotive Showroom & Import Partner',
      },
      url: { type: String, default: 'https://qzerointernational.com' },
    },
    contact: {
      email: { type: String, default: 'info@qzerointernational.com' },
      phone: { type: String, default: '+94 712 409 519' },
      phoneTel: { type: String, default: '+94712409519' },
      whatsapp: { type: String, default: '94712409519' },
      addressLine1: { type: String, default: 'No. 123, Marine Drive' },
      addressLine2: { type: String, default: 'Colombo 03, Sri Lanka' },
      mapsUrl: {
        type: String,
        default: 'https://maps.google.com/?q=Marine+Drive+Colombo+03+Sri+Lanka',
      },
      mapsEmbedUrl: {
        type: String,
        default:
          'https://maps.google.com/maps?q=Marine+Drive+Colombo+03+Sri+Lanka&output=embed',
      },
      hours: {
        type: [HourSchema],
        default: [
          { day: 'Monday — Friday', time: '9:00 AM — 6:00 PM' },
          { day: 'Saturday', time: '10:00 AM — 4:00 PM' },
          { day: 'Sunday', time: 'By Appointment' },
        ],
      },
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

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
