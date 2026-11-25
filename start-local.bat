@echo off
setlocal
cd /d "%~dp0"
where docker >nul 2>&1
if errorlevel 1 (
  if exist "%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin\docker.exe" (
    set "PATH=%LOCALAPPDATA%\Programs\DockerDesktop\resources\bin;%PATH%"
  ) else if exist "%ProgramFiles%\Docker\Docker\resources\bin\docker.exe" (
    set "PATH=%ProgramFiles%\Docker\Docker\resources\bin;%PATH%"
  )
)
where docker >nul 2>&1
if errorlevel 1 (
  echo Docker was not found. Install Docker Desktop and try again.
  pause
  exit /b 1
)
docker compose version >nul 2>&1
if errorlevel 1 (
  echo Docker Compose is unavailable. Install or update Docker Desktop.
  pause
  exit /b 1
)
docker info >nul 2>&1
if errorlevel 1 (
  echo Docker Desktop is not running. Start it and try again.
  pause
  exit /b 1
)
echo Building and starting the local development environment.
echo The first build can take a while. Open http://localhost:9000 when ready.
echo Press Ctrl+C to stop the services.
docker compose up --build --watch
if errorlevel 1 (
  echo Failed to start the local environment. See the errors above.
  pause
  exit /b 1
)
