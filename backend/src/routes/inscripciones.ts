import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Inscripcion from '../models/Inscripcion';
import Curso from '../models/Curso';
import Estudiante from '../models/Estudiante';
import Instructor from '../models/Instructor';

const router = express.Router();

// GET /inscripciones - List all inscripciones
router.get('/', async (req: Request, res: Response) => {
  try {
    const inscripciones = await Inscripcion.find();
    const populatedInscripciones = await Promise.all(
      inscripciones.map(async (inscripcion) => {
        const curso = await Curso.findOne({ id: inscripcion.cursoId });
        const estudiante = await Estudiante.findOne({ id: inscripcion.estudianteId });
        let instructor = null;
        if (curso) {
          instructor = await Instructor.findOne({ id: curso.instructorId });
        }
        return {
          ...inscripcion.toObject(),
          cursoId: curso,
          estudianteId: estudiante,
          instructorId: instructor
        };
      })
    );
    res.json(populatedInscripciones);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inscripciones', error });
  }
});

// GET /inscripciones/:id - Get a single inscripcion
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const inscripcion = await Inscripcion.findById(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripcion not found' });
    }
    const curso = await Curso.findOne({ id: inscripcion.cursoId });
    const estudiante = await Estudiante.findOne({ id: inscripcion.estudianteId });
    let instructor = null;
    if (curso && curso.instructorId) {
      instructor = await Instructor.findOne({ id: curso.instructorId });
    }
    const populated = {
      ...inscripcion.toObject(),
      cursoId: curso,
      estudianteId: estudiante,
      instructorId: instructor
    };
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inscripcion', error });
  }
});

// POST /inscripciones - Create a new inscripcion
router.post('/', async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { cursoId, estudianteId } = req.body;

    // Verificar que el curso existe
    const curso = await Curso.findOne({ id: cursoId }).session(session);
    if (!curso) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Curso not found' });
    }

    // Verificar que el estudiante existe
    const estudiante = await Estudiante.findOne({ id: estudianteId }).session(session);
    if (!estudiante) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'Estudiante not found' });
    }

    // Crear la inscripción
    const inscripcion = new Inscripcion(req.body);
    await inscripcion.save({ session });

    await session.commitTransaction();

    // Populate for response
    const populated = {
      ...inscripcion.toObject(),
      cursoId: curso,
      estudianteId: estudiante
    };
    res.status(201).json(populated);
  } catch (error: any) {
    await session.abortTransaction();
    if (error.code === 11000) {
      res.status(400).json({ message: 'Inscripcion with this cursoId and estudianteId already exists' });
    } else {
      res.status(400).json({ message: 'Error creating inscripcion', error: error.message });
    }
  } finally {
    session.endSession();
  }
});

// PUT /inscripciones/:id - Update a inscripcion
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const inscripcion = await Inscripcion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripcion not found' });
    }
    const curso = await Curso.findOne({ id: inscripcion.cursoId });
    const estudiante = await Estudiante.findOne({ id: inscripcion.estudianteId });
    const populated = {
      ...inscripcion.toObject(),
      cursoId: curso,
      estudianteId: estudiante
    };
    res.json(populated);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating inscripcion', error: error.message });
  }
});

// DELETE /inscripciones/:id - Delete a inscripcion
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const inscripcion = await Inscripcion.findByIdAndDelete(req.params.id);
    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripcion not found' });
    }
    res.json({ message: 'Inscripcion deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting inscripcion', error });
  }
});

export default router;