echo "🚀 Iniciando serviços do projeto 6 de Computação Distribuída ..."
echo "==============================================================="

# Função para iniciar serviço em uma nova aba de terminal (Linux/WSL)
start_service() {
    local name="$1"
    local dir="$2"
    local port="$3"

    echo "➡️ Iniciando $name na porta $port..."

    # WSL / Gnome Terminal / Linux (detecção automática)
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd $dir && npm run dev; exec bash"
    elif command -v x-terminal-emulator &> /dev/null; then
        x-terminal-emulator -e bash -c "cd $dir && npm run dev"
    else
        # fallback: rodar em background
        (cd "$dir" && npm run dev &> ../../logs/$name.log &)
        echo "  (rodando em background; logs em logs/$name.log)"
    fi
}

# Criar pasta de logs
mkdir -p logs

echo "📁 Logs em: ./logs/"

# REST (Express)
start_service "REST API" "./rest-api" "3001"

# GraphQL (Apollo + Express)
start_service "GraphQL API" "./graphql-api" "3002"

# gRPC API
start_service "gRPC API" "./grpc-api" "50051"

# SOAP API
start_service "SOAP API" "./soap-api" "3004"

echo "==============================================================="
echo "🔥 Todos os serviços foram iniciados!"
echo "REST     → http://localhost:3001"
echo "GraphQL  → http://localhost:3002/graphql"
echo "SOAP     → http://localhost:3004/soap?wsdl"
echo "gRPC     → rodando na porta 50051"
echo "==============================================================="
