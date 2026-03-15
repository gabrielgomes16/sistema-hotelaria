Comando unico (recomendado)
1) Na raiz do repositorio, execute:
  chmod +x subir-tudo.sh && ./subir-tudo.sh

Esse comando:
- sobe o banco postgres no Docker (container hotelaria-postgres)
- instala dependencias (se necessario)
- sobe backend (porta 3000)
- sobe frontend (porta 5173)

Para parar backend e frontend: Ctrl+C no terminal do script.

Opcao manual
1) Banco:
  docker start hotelaria-postgres || docker run --name hotelaria-postgres -e POSTGRES_PASSWORD=banco123 -e POSTGRES_DB=sistema -p 5432:5432 -d postgres:16

2) Backend:
  cd backend-atualizado-022026
  npm install
  npx nodemon app.js

3) Frontend:
  cd sistema_hotelaria
  npm install
  npm run dev -- --host

URL do sistema:
- http://localhost:5173
