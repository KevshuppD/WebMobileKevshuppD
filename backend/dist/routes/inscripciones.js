"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Inscripcion_1 = __importDefault(require("../models/Inscripcion"));
const router = express_1.default.Router();
// GET /inscripciones - List all inscripciones
router.get('/', async (req, res) => {
    try {
        const inscripciones = await Inscripcion_1.default.find().populate('cursoId').populate('estudianteId');
        res.json(inscripciones);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching inscripciones', error });
    }
});
// GET /inscripciones/:id - Get a single inscripcion
router.get('/:id', async (req, res) => {
    try {
        const inscripcion = await Inscripcion_1.default.findById(req.params.id).populate('cursoId').populate('estudianteId');
        if (!inscripcion) {
            return res.status(404).json({ message: 'Inscripcion not found' });
        }
        res.json(inscripcion);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching inscripcion', error });
    }
});
// POST /inscripciones - Create a new inscripcion
router.post('/', async (req, res) => {
    try {
        const inscripcion = new Inscripcion_1.default(req.body);
        await inscripcion.save();
        await inscripcion.populate('cursoId');
        await inscripcion.populate('estudianteId');
        res.status(201).json(inscripcion);
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Inscripcion with this cursoId and estudianteId already exists' });
        }
        else {
            res.status(400).json({ message: 'Error creating inscripcion', error: error.message });
        }
    }
});
// PUT /inscripciones/:id - Update a inscripcion
router.put('/:id', async (req, res) => {
    try {
        const inscripcion = await Inscripcion_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!inscripcion) {
            return res.status(404).json({ message: 'Inscripcion not found' });
        }
        await inscripcion.populate('cursoId');
        await inscripcion.populate('estudianteId');
        res.json(inscripcion);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating inscripcion', error: error.message });
    }
});
// DELETE /inscripciones/:id - Delete a inscripcion
router.delete('/:id', async (req, res) => {
    try {
        const inscripcion = await Inscripcion_1.default.findByIdAndDelete(req.params.id);
        if (!inscripcion) {
            return res.status(404).json({ message: 'Inscripcion not found' });
        }
        res.json({ message: 'Inscripcion deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting inscripcion', error });
    }
});
exports.default = router;
