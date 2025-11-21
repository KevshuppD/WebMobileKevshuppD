"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Curso_1 = __importDefault(require("../models/Curso"));
const Instructor_1 = __importDefault(require("../models/Instructor"));
const Estudiante_1 = __importDefault(require("../models/Estudiante"));
const Inscripcion_1 = __importDefault(require("../models/Inscripcion"));
const router = express_1.default.Router();
router.get('/', async (_req, res) => {
    try {
        const [totalCursos, totalInstructores, totalEstudiantes, totalInscripciones] = await Promise.all([
            Curso_1.default.countDocuments(),
            Instructor_1.default.countDocuments(),
            Estudiante_1.default.countDocuments(),
            Inscripcion_1.default.countDocuments()
        ]);
        const ventasGlobal = await Inscripcion_1.default.aggregate([
            {
                $lookup: {
                    from: 'cursos',
                    localField: 'cursoId',
                    foreignField: 'id',
                    as: 'curso'
                }
            },
            { $unwind: '$curso' },
            {
                $group: {
                    _id: null,
                    totalIngresos: { $sum: '$curso.precio' },
                    totalInscripcionesPagadas: { $sum: 1 }
                }
            }
        ]);
        const ventasPorCurso = await Inscripcion_1.default.aggregate([
            {
                $lookup: {
                    from: 'cursos',
                    localField: 'cursoId',
                    foreignField: 'id',
                    as: 'curso'
                }
            },
            { $unwind: '$curso' },
            {
                $group: {
                    _id: '$cursoId',
                    titulo: { $first: '$curso.titulo' },
                    categoria: { $first: '$curso.categoria' },
                    inscripciones: { $sum: 1 },
                    ingresos: { $sum: '$curso.precio' }
                }
            },
            { $sort: { ingresos: -1 } }
        ]);
        const resumen = ventasGlobal[0] ?? { totalIngresos: 0, totalInscripcionesPagadas: 0 };
        res.json({
            totales: {
                cursos: totalCursos,
                instructores: totalInstructores,
                estudiantes: totalEstudiantes,
                inscripciones: totalInscripciones
            },
            ventas: {
                totalIngresos: resumen.totalIngresos,
                totalInscripciones: resumen.totalInscripcionesPagadas,
                promedioTicket: resumen.totalInscripcionesPagadas === 0
                    ? 0
                    : resumen.totalIngresos / resumen.totalInscripcionesPagadas,
                detalle: ventasPorCurso
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error generando reporte', error });
    }
});
exports.default = router;
