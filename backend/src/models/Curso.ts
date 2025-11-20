import mongoose, { Schema, Document } from 'mongoose';
import Counter from './Counter';

export interface ICurso extends Document {
  id: number;
  titulo: string;
  descripcion: string;
  categoria: 'programacion' | 'dise�o' | 'marketing' | 'finanzas' | 'otro';
  nivel: 'beginner' | 'intermediate' | 'advanced';
  horas: number;
  precio: number;
  fechaInicio: Date;
  fechaFin: Date;
  estado: 'draft' | 'published' | 'archived';
  instructorId: number;
}

const cursoSchema: Schema = new Schema({
  id: {
    type: Number,
    unique: true
  },
  titulo: {
    type: String,
    required: true,
    minlength: 5,
    unique: true
  },
  descripcion: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 500
  },
  categoria: {
    type: String,
    enum: ['programacion', 'dise�o', 'marketing', 'finanzas', 'otro'],
    required: true
  },
  nivel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  horas: {
    type: Number,
    required: true,
    min: 1
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    required: true
  },
  instructorId: {
    type: Number,
    required: true,
    ref: 'Instructor'
  }
}, {
  timestamps: true
});

// Validation for fechaFin >= fechaInicio and set auto-increment id
cursoSchema.pre<ICurso>('save', async function(next) {
  if (this.fechaFin < this.fechaInicio) {
    return next(new Error('fechaFin must be greater than or equal to fechaInicio'));
  }
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'cursoId',
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

export default mongoose.model<ICurso>('Curso', cursoSchema);