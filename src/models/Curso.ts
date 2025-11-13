import mongoose, { Schema, Document } from 'mongoose';

export interface ICurso extends Document {
  titulo: string;
  descripcion: string;
  categoria: 'programacion' | 'diseño' | 'marketing' | 'finanzas' | 'otro';
  nivel: 'beginner' | 'intermediate' | 'advanced';
  horas: number;
  precio: number;
  fechaInicio: Date;
  fechaFin: Date;
  estado: 'draft' | 'published' | 'archived';
}

const cursoSchema: Schema = new Schema({
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
    enum: ['programacion', 'diseño', 'marketing', 'finanzas', 'otro'],
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
  }
}, {
  timestamps: true
});

// Validation for fechaFin >= fechaInicio
cursoSchema.pre<ICurso>('save', function(next) {
  if (this.fechaFin < this.fechaInicio) {
    next(new Error('fechaFin must be greater than or equal to fechaInicio'));
  } else {
    next();
  }
});

export default mongoose.model<ICurso>('Curso', cursoSchema);