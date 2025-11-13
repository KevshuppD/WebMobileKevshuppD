"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Estudiante_1 = __importDefault(require("../models/Estudiante"));
const router = express_1.default.Router();
// GET /estudiantes - List all estudiantes
router.get('/', async (req, res) => {
    try {
        const estudiantes = await Estudiante_1.default.find();
        res.json(estudiantes);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching estudiantes', error });
    }
});
// GET /estudiantes/:id - Get a single estudiante
router.get('/:id', async (req, res) => {
    try {
        const estudiante = await Estudiante_1.default.findById(req.params.id);
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante not found' });
        }
        res.json(estudiante);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching estudiante', error });
    }
});
// POST /estudiantes - Create a new estudiante
router.post('/', async (req, res) => {
    try {
        const estudiante = new Estudiante_1.default(req.body);
        await estudiante.save();
        res.status(201).json(estudiante);
    }
    catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Estudiante with this email already exists' });
        }
        else {
            res.status(400).json({ message: 'Error creating estudiante', error: error.message });
        }
    }
});
// PUT /estudiantes/:id - Update a estudiante
router.put('/:id', async (req, res) => {
    try {
        const estudiante = await Estudiante_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante not found' });
        }
        res.json(estudiante);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating estudiante', error: error.message });
    }
});
// DELETE /estudiantes/:id - Delete a estudiante
router.delete('/:id', async (req, res) => {
    try {
        const estudiante = await Estudiante_1.default.findByIdAndDelete(req.params.id);
        if (!estudiante) {
            return res.status(404).json({ message: 'Estudiante not found' });
        }
        res.json({ message: 'Estudiante deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting estudiante', error });
    }
});
exports.default = router;
