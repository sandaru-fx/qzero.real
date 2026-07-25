import mongoose, { Schema, Model, Document } from 'mongoose';
import type { WhatsAppClickSource } from '@/types/whatsapp-click';

export type { WhatsAppClickSource };

export interface IWhatsAppClick extends Document {
  source: WhatsAppClickSource;
  vehicleSlug?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WhatsAppClickSchema = new Schema<IWhatsAppClick>(
  {
    source: {
      type: String,
      enum: ['floating', 'vehicle_inquire', 'contact_owner', 'contact_manager'],
      required: true,
      index: true,
    },
    vehicleSlug: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

WhatsAppClickSchema.index({ createdAt: -1 });

const WhatsAppClick: Model<IWhatsAppClick> =
  mongoose.models.WhatsAppClick ||
  mongoose.model<IWhatsAppClick>('WhatsAppClick', WhatsAppClickSchema);

export default WhatsAppClick;
