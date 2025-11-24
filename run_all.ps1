Write-Host "======================================"
Write-Host " 🚀 Iniciando execução completa (Windows)"
Write-Host "======================================"

$ROOT = Get-Location
Write-Host "📁 Projeto: $ROOT"

# ------------------------------------------
# 1. Instalar dependências Node
# ------------------------------------------
Write-Host "`n======================================"
Write-Host " 📦 Instalando dependências Node..."
Write-Host "======================================"

Set-Location "$ROOT/node/rest"
npm install

Set-Location "$ROOT/node/graphql"
npm install

Set-Location "$ROOT/node/soap"
npm install

Set-Location "$ROOT/node/grpc"
npm install


# ------------------------------------------
# 2. Instalar dependências Python
# ------------------------------------------
Write-Host "`n======================================"
Write-Host " 🐍 Instalando dependências Python..."
Write-Host "======================================"

Set-Location "$ROOT/python"

# Python deps
pip install -r requirements.txt
pip install fastapi uvicorn strawberry-graphql grpcio grpcio-tools spyne


# ------------------------------------------
# 3. Gerar Protobuf (Node + Python)
# ------------------------------------------
Write-Host "`n======================================"
Write-Host " 🛠️ Gerando protobuf (Node)..."
Write-Host "======================================"

Set-Location "$ROOT/node/grpc"
if (Test-Path "generate.bat") {
    ./generate.bat
} else {
    npx protoc --js_out=import_style=commonjs,binary:. --grpc_out=. --proto_path=. music.proto
}

Write-Host "`n======================================"
Write-Host " 🛠️ Gerando protobuf (Python)..."
Write-Host "======================================"

Set-Location "$ROOT/python/grpc"
python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. music.proto


# ------------------------------------------
# 4. Subir serviços em background
# ------------------------------------------
Write-Host "`n======================================"
Write-Host " 🚀 Subindo serviços Node..."
Write-Host "======================================"

Start-Process powershell -ArgumentList "cd '$ROOT/node/rest'; npm run dev" -WindowStyle Minimized
Start-Process powershell -ArgumentList "cd '$ROOT/node/graphql'; npm run dev" -WindowStyle Minimized
Start-Process powershell -ArgumentList "cd '$ROOT/node/soap'; npm run dev" -WindowStyle Minimized
Start-Process powershell -ArgumentList "cd '$ROOT/node/grpc'; npm run dev" -WindowStyle Minimized


Write-Host "`n======================================"
Write-Host " 🚀 Subindo serviços Python..."
Write-Host "======================================"

Start-Process powershell -ArgumentList "cd '$ROOT/python/rest'; uvicorn app:app --port 8001" -WindowStyle Minimized
Start-Process powershell -ArgumentList "cd '$ROOT/python/graphql_api'; uvicorn app:app --port 8003" -WindowStyle Minimized
Start-Process powershell -ArgumentList "cd '$ROOT/python/soap'; python app.py" -WindowStyle Minimized
Start-Process powershell -ArgumentList "cd '$ROOT/python/grpc'; python server.py" -WindowStyle Minimized

Start-Sleep -Seconds 7

Write-Host "`n======================================"
Write-Host " 🟢 Todos os serviços iniciados!"
Write-Host "======================================"


# ------------------------------------------
# 5. Executar testes (K6 + ghz)
# ------------------------------------------
Write-Host "`n======================================"
Write-Host " 🔥 Executando testes K6"
Write-Host "======================================"

Set-Location "$ROOT"
New-Item -ItemType Directory -Force -Path "results" | Out-Null

k6 run tests/k6_rest.js --out json=results/rest.json
k6 run tests/k6_graphql.js --out json=results/graphql.json
k6 run tests/k6_soap.js --out json=results/soap.json

Write-Host "`n======================================"
Write-Host " ⚡ Executando testes gRPC (ghz)"
Write-Host "======================================"

ghz --insecure `
    --proto python/grpc/music.proto `
    --call Music.ListarUsuarios `
    -n 2000 `
    127.0.0.1:8004 | Out-File results/grpc.txt


# ------------------------------------------
# 6. Gerar gráficos
# ------------------------------------------
Write-Host "`n======================================"
Write-Host " 📊 Gerando gráficos..."
Write-Host "======================================"

python chart.py

Write-Host "`n======================================"
Write-Host " 🎉 TUDO FINALIZADO COM SUCESSO!"
Write-Host "======================================"

Write-Host "👉 Gráficos: charts/"
Write-Host "👉 Resultados: results/"
