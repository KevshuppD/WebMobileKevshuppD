"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const database_1 = __importDefault(require("./config/database"));
const cursos_1 = __importDefault(require("./routes/cursos"));
const instructores_1 = __importDefault(require("./routes/instructores"));
const estudiantes_1 = __importDefault(require("./routes/estudiantes"));
const inscripciones_1 = __importDefault(require("./routes/inscripciones"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Connect to MongoDB
(0, database_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Routes
app.use('/api/cursos', cursos_1.default);
app.use('/api/instructores', instructores_1.default);
app.use('/api/estudiantes', estudiantes_1.default);
app.use('/api/inscripciones', inscripciones_1.default);
// Basic route
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
