"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const cursoSchema = new mongoose_1.Schema({
    titulo: {
        type: String,
        required: true,
        minlength: 5,
        unique: true
    },
    descripcion: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 500
    },
    categoria: {
        type: String,
        enum: ['programacion', 'dise�o', 'marketing', 'finanzas', 'otro'],
        required: true
    },
    nivel: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    horas: {
        type: Number,
        required: true,
        min: 1
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        required: true
    }
}, {
    timestamps: true
});
// Validation for fechaFin >= fechaInicio
cursoSchema.pre('save', function (next) {
    if (this.fechaFin < this.fechaInicio) {
        next(new Error('fechaFin must be greater than or equal to fechaInicio'));
    }
    else {
        next();
    }
});
exports.default = mongoose_1.default.model('Curso', cursoSchema);
