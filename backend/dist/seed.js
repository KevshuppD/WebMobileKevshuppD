"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./config/database"));
const Curso_1 = __importDefault(require("./models/Curso"));
const Instructor_1 = __importDefault(require("./models/Instructor"));
const Estudiante_1 = __importDefault(require("./models/Estudiante"));
const Inscripcion_1 = __importDefault(require("./models/Inscripcion"));
const mongoose_1 = __importDefault(require("mongoose"));
const seedDatabase = async () => {
    await (0, database_1.default)();
    // Drop database to avoid duplicates
    await mongoose_1.default.connection.dropDatabase();
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
            descripcion: "Dise�a microcopys efectivos y flujos de contenido centrados en el usuario.",
            categoria: "dise�o",
            nivel: "intermediate",
            horas: 8,
            precio: 45.5,
            fechaInicio: new Date("2025-11-20T00:00:00Z"),
            fechaFin: new Date("2025-12-05T00:00:00Z"),
            estado: "draft"
        },
        {
            titulo: "Finanzas Personales Avanzadas",
            descripcion: "Optimiza presupuesto, inversi�n y ahorro con casos pr�cticos y simulaciones reales.",
            categoria: "finanzas",
            nivel: "advanced",
            horas: 16,
            precio: 79.99,
            fechaInicio: new Date("2025-12-01T00:00:00Z"),
            fechaFin: new Date("2026-01-05T00:00:00Z"),
            estado: "published"
        }
    ];
    await Curso_1.default.insertMany(cursos);
    console.log('Cursos seeded');
    // Seed Instructores
    const instructores = [
        { nombre: "Laura M�ndez", email: "laura@academia.com", especialidad: "JavaScript" },
        { nombre: "Carlos Ruiz", email: "carlos@academia.com", especialidad: "UX" }
    ];
    await Instructor_1.default.insertMany(instructores);
    console.log('Instructores seeded');
    // Seed Estudiantes
    const estudiantes = [
        { nombre: "Ana Torres", email: "ana.torres@mail.com", fechaRegistro: new Date("2025-11-10T00:00:00Z") },
        { nombre: "Miguel Vega", email: "miguel.vega@mail.com", fechaRegistro: new Date("2025-11-11T00:00:00Z") }
    ];
    const insertedEstudiantes = await Estudiante_1.default.insertMany(estudiantes);
    console.log('Estudiantes seeded');
    // Seed Inscripciones
    const ana = insertedEstudiantes.find(e => e.email === "ana.torres@mail.com");
    const tsCurso = await Curso_1.default.findOne({ titulo: "TypeScript Esencial" });
    if (ana && tsCurso) {
        await Inscripcion_1.default.create({
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
