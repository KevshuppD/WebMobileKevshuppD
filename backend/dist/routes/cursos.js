"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Curso_1 = __importDefault(require("../models/Curso"));
const Instructor_1 = __importDefault(require("../models/Instructor"));
const router = express_1.default.Router();
// GET /cursos - List all cursos
router.get('/', async (req, res) => {
    try {
        const cursos = await Curso_1.default.find();
        res.json(cursos);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching cursos', error });
    }
});
// GET /cursos/:id - Get a single curso
router.get('/:id', async (req, res) => {
    try {
        const curso = await Curso_1.default.findById(req.params.id);
        if (!curso) {
            return res.status(404).json({ message: 'Curso not found' });
        }
        res.json(curso);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching curso', error });
    }
});
// POST /cursos - Create a new curso
router.post('/', async (req, res) => {
    try {
        // Validar que el instructor existe
        const instructor = await Instructor_1.default.findOne({ id: req.body.instructorId });
        if (!instructor) {
            return res.status(400).json({ message: 'Instructor not found' });
        }
        const curso = new Curso_1.default(req.body);
        await curso.save();
        res.status(201).json(curso);
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Curso with this titulo already exists' });
        }
        else {
            res.status(400).json({ message: 'Error creating curso', error: error.message });
        }
    }
});
// PUT /cursos/:id - Update a curso
router.put('/:id', async (req, res) => {
    try {
        const curso = await Curso_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!curso) {
            return res.status(404).json({ message: 'Curso not found' });
        }
        res.json(curso);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating curso', error: error.message });
    }
});
// DELETE /cursos/:id - Delete a curso
router.delete('/:id', async (req, res) => {
    try {
        const curso = await Curso_1.default.findByIdAndDelete(req.params.id);
        if (!curso) {
            return res.status(404).json({ message: 'Curso not found' });
        }
        res.json({ message: 'Curso deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting curso', error });
    }
});
exports.default = router;
