Write-Host "Cerrando procesos Node residuales..." -ForegroundColor Cyan
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Instalando dependencias..." -ForegroundColor Cyan
if (Test-Path node_modules) {
  Write-Host "node_modules ya existe. Continuando..."
} else {
  npm ci 2>$null
  if ($LASTEXITCODE -ne 0) { npm install }
}

Write-Host "Levantando Angular..." -ForegroundColor Green
npx ng serve --open --proxy-config proxy.conf.json
