import express from 'express';
import cors from 'cors';
import connectDB from './config/database';
import cursoRoutes from './routes/cursos';
import instructorRoutes from './routes/instructores';
import estudianteRoutes from './routes/estudiantes';
import inscripcionRoutes from './routes/inscripciones';

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/cursos', cursoRoutes);
app.use('/api/instructores', instructorRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/inscripciones', inscripcionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});