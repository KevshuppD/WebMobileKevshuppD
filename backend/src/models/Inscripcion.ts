import mongoose, { Schema, Document } from 'mongoose';

export interface IInscripcion extends Document {
  cursoId: mongoose.Types.ObjectId;
  estudianteId: mongoose.Types.ObjectId;
  fechaRegistro: Date;
  estado: 'activa' | 'pendiente' | 'cancelada';
}

const inscripcionSchema: Schema = new Schema({
  cursoId: {
    type: Schema.Types.ObjectId,
    ref: 'Curso',
    required: true
  },
  estudianteId: {
    type: Schema.Types.ObjectId,
    ref: 'Estudiante',
    required: true
  },
  fechaRegistro: {
    type: Date,
    required: true
  },
  estado: {
    type: String,
    enum: ['activa', 'pendiente', 'cancelada'],
    required: true
  }
}, {
  timestamps: true
});

// Compound unique index
inscripcionSchema.index({ cursoId: 1, estudianteId: 1 }, { unique: true });

export default mongoose.model<IInscripcion>('Inscripcion', inscripcionSchema);