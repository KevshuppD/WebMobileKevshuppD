import mongoose, { Schema, Document } from 'mongoose';

export interface IInstructor extends Document {
  nombre: string;
  email: string;
  especialidad: string;
}

const instructorSchema: Schema = new Schema({
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

export default mongoose.model<IInstructor>('Instructor', instructorSchema);