import express, { Request, Response } from 'express';
import Estudiante from '../models/Estudiante';

const router = express.Router();

// GET /estudiantes - List all estudiantes
router.get('/', async (req: Request, res: Response) => {
  try {
    const estudiantes = await Estudiante.find();
    res.json(estudiantes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching estudiantes', error });
  }
});

// GET /estudiantes/:id - Get a single estudiante
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const estudiante = await Estudiante.findById(req.params.id);
    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante not found' });
    }
    res.json(estudiante);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching estudiante', error });
  }
});

// POST /estudiantes - Create a new estudiante
router.post('/', async (req: Request, res: Response) => {
  try {
    const estudiante = new Estudiante(req.body);
    await estudiante.save();
    res.status(201).json(estudiante);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Estudiante with this email already exists' });
    } else {
      res.status(400).json({ message: 'Error creating estudiante', error: error.message });
    }
  }
});

// PUT /estudiantes/:id - Update a estudiante
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const estudiante = await Estudiante.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante not found' });
    }
    res.json(estudiante);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating estudiante', error: error.message });
  }
});

// DELETE /estudiantes/:id - Delete a estudiante
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const estudiante = await Estudiante.findByIdAndDelete(req.params.id);
    if (!estudiante) {
      return res.status(404).json({ message: 'Estudiante not found' });
    }
    res.json({ message: 'Estudiante deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting estudiante', error });
  }
});

export default router;