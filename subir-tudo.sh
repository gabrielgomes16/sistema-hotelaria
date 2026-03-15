#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACK_DIR="$ROOT_DIR/backend-atualizado-022026"
FRONT_DIR="$ROOT_DIR/sistema_hotelaria"
DB_CONTAINER="hotelaria-postgres"

BACK_PID=""
FRONT_PID=""

cleanup() {
  if [[ -n "$BACK_PID" ]]; then
    kill "$BACK_PID" 2>/dev/null || true
  fi

  if [[ -n "$FRONT_PID" ]]; then
    kill "$FRONT_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

if ! command -v docker >/dev/null 2>&1; then
  echo "Erro: Docker nao encontrado. Instale o Docker para subir o banco." >&2
  exit 1
fi

if docker ps -a --format '{{.Names}}' | grep -q "^${DB_CONTAINER}$"; then
  docker start "$DB_CONTAINER" >/dev/null 2>&1 || true
else
  docker run --name "$DB_CONTAINER" \
    -e POSTGRES_PASSWORD=banco123 \
    -e POSTGRES_DB=sistema \
    -p 5432:5432 \
    -d postgres:16 >/dev/null
fi

echo "Banco pronto em localhost:5432"

if [[ ! -d "$BACK_DIR/node_modules" ]]; then
  echo "Instalando dependencias do backend..."
  (cd "$BACK_DIR" && npm install)
fi

if [[ ! -d "$FRONT_DIR/node_modules" ]]; then
  echo "Instalando dependencias do frontend..."
  (cd "$FRONT_DIR" && npm install)
fi

echo "Iniciando backend em http://localhost:3000"
(cd "$BACK_DIR" && npx nodemon app.js) &
BACK_PID=$!

echo "Iniciando frontend em http://localhost:5173"
(cd "$FRONT_DIR" && npm run dev -- --host) &
FRONT_PID=$!

echo "Aplicacao no ar. Use Ctrl+C para parar backend e frontend."

wait "$BACK_PID" "$FRONT_PID"
