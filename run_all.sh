#!/bin/bash

set -e  # parar se der erro

echo "======================================"
echo " 🚀 Iniciando execução completa"
echo "======================================"

PROJECT_ROOT="$(pwd)"

echo "📁 Projeto: $PROJECT_ROOT"

# ----------------------------
# 1. Instalar dependências
# ----------------------------
echo ""
echo "======================================"
echo " 📦 Instalando dependências Node..."
echo "======================================"

cd node/rest && npm install && cd ../..
cd node/graphql && npm install && cd ../..
cd node/soap && npm install && cd ../..
cd node/grpc && npm install && cd ../..

echo ""
echo "======================================"
echo " 🐍 Instalando dependências Python..."
echo "======================================"

cd python
pip install -r requirements.txt || pip install fastapi uvicorn strawberry-graphql grpcio grpcio-tools spyne
cd ..

# ----------------------------
# 2. Gerar protobuf (Node + Python)
# ----------------------------
echo ""
echo "======================================"
echo " 🛠️ Gerando protobuf (Node)..."
echo "======================================"
cd node/grpc
npm run proto || ./generate.sh || true
cd ../..

echo ""
echo "======================================"
echo " 🛠️ Gerando protobuf (Python)..."
echo "======================================"
cd python/grpc
python3 -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. music.proto
cd ../..

# ----------------------------
# 3. Subir serviços em background
# ----------------------------
echo ""
echo "======================================"
echo " 🚀 Subindo serviços Node..."
echo "======================================"

cd node/rest && npm run dev &
REST_NODE_PID=$!
cd ../graphql && npm run dev &
GRAPHQL_NODE_PID=$!
cd ../soap && npm run dev &
SOAP_NODE_PID=$!
cd ../grpc && npm run dev &
GRPC_NODE_PID=$!
cd ../..

echo ""
echo "======================================"
echo " 🚀 Subindo serviços Python..."
echo "======================================"

cd python/rest && uvicorn app:app --port 8001 &
REST_PY_PID=$!
cd ../graphql_api && uvicorn app:app --port 8003 &
GRAPHQL_PY_PID=$!
cd ../soap && python3 app.py &
SOAP_PY_PID=$!
cd ../grpc && python3 server.py &
GRPC_PY_PID=$!
cd ../..

sleep 5  # dar tempo para subir

echo ""
echo "======================================"
echo " 🟢 Todos os serviços subiram!"
echo "======================================"

# ----------------------------
# 4. Executar testes de carga
# ----------------------------
echo ""
echo "======================================"
echo " 🔥 Executando testes K6 (REST/GraphQL/SOAP)"
echo "======================================"

mkdir -p results

k6 run tests/k6_rest.js --out json=results/rest.json
k6 run tests/k6_graphql.js --out json=results/graphql.json
k6 run tests/k6_soap.js --out json=results/soap.json

echo ""
echo "======================================"
echo " ⚡ Executando testes gRPC (ghz)"
echo "======================================"

ghz --insecure \
    --proto python/grpc/music.proto \
    --call Music.ListarUsuarios \
    -n 2000 \
    0.0.0.0:8004 > results/grpc.txt

# ----------------------------
# 5. Gerar gráficos
# ----------------------------
echo ""
echo "======================================"
echo " 📊 Gerando gráficos..."
echo "======================================"

python3 chart.py

echo ""
echo "======================================"
echo " 🎉 TUDO FINALIZADO COM SUCESSO!"
echo "======================================"

echo "👉 Gráficos em: charts/"
echo "👉 Resultados brutos em: results/"

# ----------------------------
# 6. Final opcional: matar serviços
# ----------------------------
echo ""
echo "🛑 Finalizar serviços em background? (y/n)"
read -r killopt

if [ "$killopt" = "y" ]; then
    kill $REST_NODE_PID $GRAPHQL_NODE_PID $SOAP_NODE_PID $GRPC_NODE_PID \
         $REST_PY_PID $GRAPHQL_PY_PID $SOAP_PY_PID $GRPC_PY_PID || true
    echo "✔ Serviços encerrados."
else
    echo "ℹ Serviços continuam rodando."
fi
