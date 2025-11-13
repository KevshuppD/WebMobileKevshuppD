import express, { Request, Response } from 'express';
import Instructor from '../models/Instructor';

const router = express.Router();

// GET /instructores - List all instructores
router.get('/', async (req: Request, res: Response) => {
  try {
    const instructores = await Instructor.find();
    res.json(instructores);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching instructores', error });
  }
});

// GET /instructores/:id - Get a single instructor
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findById(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.json(instructor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching instructor', error });
  }
});

// POST /instructores - Create a new instructor
router.post('/', async (req: Request, res: Response) => {
  try {
    const instructor = new Instructor(req.body);
    await instructor.save();
    res.status(201).json(instructor);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Instructor with this email already exists' });
    } else {
      res.status(400).json({ message: 'Error creating instructor', error: error.message });
    }
  }
});

// PUT /instructores/:id - Update a instructor
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.json(instructor);
  } catch (error: any) {
    res.status(400).json({ message: 'Error updating instructor', error: error.message });
  }
});

// DELETE /instructores/:id - Delete a instructor
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const instructor = await Instructor.findByIdAndDelete(req.params.id);
    if (!instructor) {
      return res.status(404).json({ message: 'Instructor not found' });
    }
    res.json({ message: 'Instructor deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting instructor', error });
  }
});

export default router;