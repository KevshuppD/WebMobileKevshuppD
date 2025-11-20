import mongoose, { Schema, Document } from 'mongoose';
import Counter from './Counter';

export interface IEstudiante extends Document {
  id: number;
  nombre: string;
  email: string;
  fechaRegistro: Date;
}

const estudianteSchema: Schema = new Schema({
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
  fechaRegistro: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Set auto-increment id
estudianteSchema.pre<IEstudiante>('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'estudianteId',
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

export default mongoose.model<IEstudiante>('Estudiante', estudianteSchema);