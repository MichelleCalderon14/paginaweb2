@echo off
title Colegio Web Angular - Auto Start
echo Cerrando procesos Node residuales...
taskkill /f /im node.exe >NUL 2>&1

echo Verificando NPM...
where npm >NUL 2>&1
if errorlevel 1 (
  echo ERROR: No se encontro NPM/Node. Instala Node.js LTS y vuelve a ejecutar este archivo.
  pause
  exit /b 1
)

echo Instalando dependencias (puede tardar)...
if exist node_modules (
  echo Ya existe node_modules. Continuando...
) else (
  call npm ci || call npm install
)

echo Iniciando servidor de desarrollo...
call npx ng serve --open --proxy-config proxy.conf.json
