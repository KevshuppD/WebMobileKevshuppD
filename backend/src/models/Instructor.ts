import mongoose, { Schema, Document } from 'mongoose';
import Counter from './Counter';

export interface IInstructor extends Document {
  id: number;
  nombre: string;
  email: string;
  especialidad: string;
}

const instructorSchema: Schema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  especialidad: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Set auto-increment id
instructorSchema.pre<IInstructor>('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'instructorId',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.id = counter.seq;
    } catch (error) {
      return next(error instanceof Error ? error : new Error(String(error)));
    }
  }
  next();
});

export default mongoose.model<IInstructor>('Instructor', instructorSchema);