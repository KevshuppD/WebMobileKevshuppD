import connectDB from './config/database';
import Curso from './models/Curso';
import Instructor from './models/Instructor';
import Estudiante from './models/Estudiante';
import Inscripcion from './models/Inscripcion';
import mongoose from 'mongoose';

const seedDatabase = async () => {
  await connectDB();

  // Drop database to avoid duplicates
  await mongoose.connection.dropDatabase();

  // Seed Cursos
  const cursos = [
    {
      titulo: "TypeScript Esencial",
      descripcion: "Curso base para dominar tipos, interfaces y generics en entornos Node y web.",
      categoria: "programacion",
      nivel: "beginner",
      horas: 12,
      precio: 59.99,
      fechaInicio: new Date("2025-11-18T00:00:00Z"),
      fechaFin: new Date("2025-12-02T00:00:00Z"),
      estado: "published"
    },
    {
      titulo: "UX Writing Intermedio",
      descripcion: "Diseña microcopys efectivos y flujos de contenido centrados en el usuario.",
      categoria: "diseño",
      nivel: "intermediate",
      horas: 8,
      precio: 45.5,
      fechaInicio: new Date("2025-11-20T00:00:00Z"),
      fechaFin: new Date("2025-12-05T00:00:00Z"),
      estado: "draft"
    },
    {
      titulo: "Finanzas Personales Avanzadas",
      descripcion: "Optimiza presupuesto, inversión y ahorro con casos prácticos y simulaciones reales.",
      categoria: "finanzas",
      nivel: "advanced",
      horas: 16,
      precio: 79.99,
      fechaInicio: new Date("2025-12-01T00:00:00Z"),
      fechaFin: new Date("2026-01-05T00:00:00Z"),
      estado: "published"
    }
  ];

  await Curso.insertMany(cursos);
  console.log('Cursos seeded');

  // Seed Instructores
  const instructores = [
    { nombre: "Laura Méndez", email: "laura@academia.com", especialidad: "JavaScript" },
    { nombre: "Carlos Ruiz", email: "carlos@academia.com", especialidad: "UX" }
  ];

  await Instructor.insertMany(instructores);
  console.log('Instructores seeded');

  // Seed Estudiantes
  const estudiantes = [
    { nombre: "Ana Torres", email: "ana.torres@mail.com", fechaRegistro: new Date("2025-11-10T00:00:00Z") },
    { nombre: "Miguel Vega", email: "miguel.vega@mail.com", fechaRegistro: new Date("2025-11-11T00:00:00Z") }
  ];

  const insertedEstudiantes = await Estudiante.insertMany(estudiantes);
  console.log('Estudiantes seeded');

  // Seed Inscripciones
  const ana = insertedEstudiantes.find(e => e.email === "ana.torres@mail.com");
  const tsCurso = await Curso.findOne({ titulo: "TypeScript Esencial" });

  if (ana && tsCurso) {
    await Inscripcion.create({
      cursoId: tsCurso._id,
      estudianteId: ana._id,
      fechaRegistro: new Date("2025-11-12T00:00:00Z"),
      estado: "activa"
    });
    console.log('Inscripciones seeded');
  }

  process.exit(0);
};

seedDatabase().catch(console.error);