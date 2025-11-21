import express, { Request, Response } from 'express';
import Curso from '../models/Curso';
import Instructor from '../models/Instructor';
import Estudiante from '../models/Estudiante';
import Inscripcion from '../models/Inscripcion';

const router = express.Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const [totalCursos, totalInstructores, totalEstudiantes, totalInscripciones] = await Promise.all([
      Curso.countDocuments(),
      Instructor.countDocuments(),
      Estudiante.countDocuments(),
      Inscripcion.countDocuments()
    ]);

    const ventasGlobal = await Inscripcion.aggregate([
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

    const ventasPorCurso = await Inscripcion.aggregate([
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
  } catch (error) {
    res.status(500).json({ message: 'Error generando reporte', error });
  }
});

export default router;
