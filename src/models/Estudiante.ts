import mongoose, { Schema, Document } from 'mongoose';

export interface IEstudiante extends Document {
  nombre: string;
  email: string;
  fechaRegistro: Date;
}

const estudianteSchema: Schema = new Schema({
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

export default mongoose.model<IEstudiante>('Estudiante', estudianteSchema);