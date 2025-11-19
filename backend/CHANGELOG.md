En este archivo se explica cómo Visual Studio creado el proyecto.

Se usaron las siguientes herramientas para generar este proyecto:
- TypeScript Compiler (tsc)

Los pasos siguientes se usaron para generar este proyecto:
- Crear archivo de proyecto (`WebMobileKevinCastro.esproj`).
- Crear `launch.json` para habilitar la depuración.
- Instale los paquetes npm y cree `tsconfig.json`: `npm init && npm i --save-dev eslint typescript @types/node && npx tsc --init --sourceMap true`.
- Crear `app.ts`.
- Actualizar `package.json` punto de entrada.
- Actualice los scripts de compilación de TypeScript en `package.json`.
- Crear `eslint.config.js` para habilitar el linting.
- Agregue el proyecto a la solución.
- Escriba este archivo.
