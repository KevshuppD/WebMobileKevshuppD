import express, { Request, Response } from 'express';
import Inscripcion from '../models/Inscripcion';

const router = express.Router();

// GET /inscripciones - List all inscripciones
router.get('/', async (req: Request, res: Response) => {
  try {
    const inscripciones = await Inscripcion.find().populate('cursoId').populate('estudianteId');
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inscripciones', error });
  }
});

// GET /inscripciones/:id - Get a single inscripcion
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const inscripcion = await Inscripcion.findById(req.params.id).populate('cursoId').populate('estudianteId');
    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripcion not found' });
    }
    res.json(inscripcion);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inscripcion', error });
  }
});

// POST /inscripciones - Create a new inscripcion
router.post('/', async (req: Request, res: Response) => {
  try {
    const inscripcion = new Inscripcion(req.body);
    await inscripcion.save();
    await inscripcion.populate('cursoId');
    await inscripcion.populate('estudianteId');
    res.status(201).json(inscripcion);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Inscripcion with this cursoId and estudianteId already exists' });
    } else {
      res.status(400).json({ message: 'Error creating inscripcion', error: error.message });
    }
  }
});

// PUT /inscripciones/:id - Update a inscripcion
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const inscripcion = await Inscripcion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripcion not found' });
    }
    await inscripcion.populate('cursoId');
    await inscripcion.populate('estudianteId');
    res.json(inscripcion);
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