"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Instructor_1 = __importDefault(require("../models/Instructor"));
const router = express_1.default.Router();
// GET /instructores - List all instructores
router.get('/', async (req, res) => {
    try {
        const instructores = await Instructor_1.default.find();
        res.json(instructores);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching instructores', error });
    }
});
// GET /instructores/:id - Get a single instructor
router.get('/:id', async (req, res) => {
    try {
        const instructor = await Instructor_1.default.findById(req.params.id);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.json(instructor);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching instructor', error });
    }
});
// POST /instructores - Create a new instructor
router.post('/', async (req, res) => {
    try {
        const instructor = new Instructor_1.default(req.body);
        await instructor.save();
        res.status(201).json(instructor);
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Instructor with this email already exists' });
        }
        else {
            res.status(400).json({ message: 'Error creating instructor', error: error.message });
        }
    }
});
// PUT /instructores/:id - Update a instructor
router.put('/:id', async (req, res) => {
    try {
        const instructor = await Instructor_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.json(instructor);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating instructor', error: error.message });
    }
});
// DELETE /instructores/:id - Delete a instructor
router.delete('/:id', async (req, res) => {
    try {
        const instructor = await Instructor_1.default.findByIdAndDelete(req.params.id);
        if (!instructor) {
            return res.status(404).json({ message: 'Instructor not found' });
        }
        res.json({ message: 'Instructor deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting instructor', error });
    }
});
exports.default = router;
