import express, { Request, Response } from 'express';
import Curso from '../models/Curso';
import Instructor from '../models/Instructor';

const router = express.Router();

// GET /cursos - List all cursos
router.get('/', async (req: Request, res: Response) => {
  try {
    const cursos = await Curso.find();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cursos', error });
  }
});

// GET /cursos/:id - Get a single curso
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const curso = await Curso.findById(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso not found' });
    }
    res.json(curso);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching curso', error });
  }
});

// POST /cursos - Create a new curso
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validar que el instructor existe
    const instructor = await Instructor.findOne({ id: req.body.instructorId });
    if (!instructor) {
      return res.status(400).json({ message: 'Instructor not found' });
    }

    const curso = new Curso(req.body);
    await curso.save();
    res.status(201).json(curso);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Curso with this titulo already exists' });
    } else {
      res.status(400).json({ message: 'Error creating curso', error: error.message });
    }
  }
});

// PUT /cursos/:id - Update a curso
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const curso = await Curso.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!curso) {
      return res.status(404).json({ message: 'Curso not found' });
    }
    res.json(curso);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating curso', error: error.message });
  }
});

// DELETE /cursos/:id - Delete a curso
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const curso = await Curso.findByIdAndDelete(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso not found' });
    }
    res.json({ message: 'Curso deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting curso', error });
  }
});

export default router;