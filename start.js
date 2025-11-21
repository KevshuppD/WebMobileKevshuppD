#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const npmCommand = process.platform === 'win32' ? 'cmd.exe' : 'npm';
const npmStartArgs = process.platform === 'win32' ? ['/c', 'npm', 'start'] : ['start'];

console.log('🚀 INICIANDO SERVIDORES - BIBLIOTECA DE CURSOS');
console.log('===============================================');
console.log();

// Verificar si Node.js y npm están disponibles
try {
    execSync('node --version', { stdio: 'pipe' });
    console.log('✅ Node.js detectado');
} catch (error) {
    console.error('❌ ERROR: Node.js no está instalado');
    console.error('Por favor instala Node.js desde https://nodejs.org/');
    process.exit(1);
}

try {
    execSync('npm --version', { stdio: 'pipe' });
    console.log('✅ npm detectado');
} catch (error) {
    console.error('❌ ERROR: npm no está disponible');
    process.exit(1);
}

console.log();

// Función para verificar e instalar dependencias
function checkAndInstallDependencies(dir, name) {
    const nodeModulesPath = path.join(dir, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
        console.log(`📦 Instalando dependencias de ${name}...`);
        try {
            execSync('npm install', { cwd: dir, stdio: 'inherit' });
            console.log(`✅ Dependencias de ${name} instaladas`);
        } catch (error) {
            console.error(`❌ ERROR: Falló la instalación de dependencias de ${name}`);
            process.exit(1);
        }
    } else {
        console.log(`✅ Dependencias de ${name} ya instaladas`);
    }
}

// Verificar dependencias
const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

checkAndInstallDependencies(backendDir, 'backend');
checkAndInstallDependencies(frontendDir, 'frontend');

console.log();
console.log('🔨 Construyendo backend...');

// Compilar backend
try {
    execSync('npm run build', { cwd: backendDir, stdio: 'inherit' });
    console.log('✅ Backend compilado exitosamente');
} catch (error) {
    console.error('❌ ERROR: Falló la compilación del backend');
    process.exit(1);
}

console.log();

function getPortPids(port) {
    try {
        if (process.platform === 'win32') {
            const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
            const pids = new Set();
            output.split(/\r?\n/).forEach(line => {
                const trimmed = line.trim();
                if (!trimmed) return;
                const parts = trimmed.split(/\s+/);
                const pid = parts[parts.length - 1];
                const pidNum = parseInt(pid, 10);
                if (!Number.isNaN(pidNum) && pidNum > 0) {
                    pids.add(String(pidNum));
                }
            });
            return Array.from(pids);
        }

        const output = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf8' });
        return output.split(/\r?\n/).filter(Boolean);
    } catch (error) {
        return [];
    }
}

function freePort(port, label) {
    const pids = getPortPids(port);
    if (pids.length === 0) {
        return;
    }

    console.log(`⚠️  Puerto ${port} ocupado (${label}). Intentando liberar procesos previos...`);
    pids.forEach(pid => {
        try {
            if (process.platform === 'win32') {
                execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
            } else {
                execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
            }
            console.log(`   • PID ${pid} terminado`);
        } catch (error) {
            console.error(`   • No se pudo terminar PID ${pid}: ${error.message}`);
        }
    });

    const remaining = getPortPids(port);
    if (remaining.length > 0) {
        console.error(`❌ Puerto ${port} sigue ocupado. Libéralo manualmente e inténtalo de nuevo.`);
        process.exit(1);
    }

    console.log(`✅ Puerto ${port} liberado`);
}

function ensurePortsFree() {
    freePort(3000, 'Backend');
    freePort(3001, 'Frontend');
}

ensurePortsFree();

console.log('🌟 Iniciando servidores...');

// Array para mantener referencias a los procesos
const processes = [];

// Función para iniciar un proceso
function startProcess(name, command, args, cwd, port) {
    console.log(`🚀 Iniciando ${name} en puerto ${port}...`);

    const proc = spawn(command, args, {
        cwd: cwd,
        stdio: 'inherit'
    });

    proc.on('error', (error) => {
        console.error(`❌ Error al iniciar ${name}:`, error.message);
    });

    proc.on('close', (code) => {
        console.log(`🛑 ${name} se cerró con código ${code}`);
    });

    processes.push(proc);
    return proc;
}

// Iniciar backend
const backendProcess = startProcess(
    'Backend',
    npmCommand,
    npmStartArgs,
    backendDir,
    3000
);

// Esperar un poco para que el backend inicie
setTimeout(() => {
    // Iniciar frontend
    const frontendProcess = startProcess(
        'Frontend',
        npmCommand,
        npmStartArgs,
        frontendDir,
        3001
    );

    console.log();
    console.log('===============================================');
    console.log('         ¡SERVIDORES INICIADOS!');
    console.log('===============================================');
    console.log();
    console.log('🌐 Aplicación web: http://localhost:3001');
    console.log('🔧 API Backend:    http://localhost:3000');
    console.log();
    console.log('Los servidores están ejecutándose.');
    console.log('Presiona Ctrl+C para detener todos los servidores');
    console.log();

    // Mantener el script corriendo
    process.stdin.resume();
}, 3000);

// Manejar señales de terminación
process.on('SIGINT', () => {
    console.log();
    console.log('🛑 Cerrando servidores...');

    processes.forEach(proc => {
        try {
            proc.kill('SIGTERM');
        } catch (error) {
            // Ignorar errores al matar procesos
        }
    });

    setTimeout(() => {
        console.log('✅ Servidores cerrados');
        process.exit(0);
    }, 2000);
});

process.on('SIGTERM', () => {
    console.log('🛑 Recibida señal de terminación');
    process.exit(0);
});