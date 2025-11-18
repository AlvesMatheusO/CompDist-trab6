import json
import re
import os
import matplotlib.pyplot as plt
import pandas as pd

RESULTS_DIR = "results"
CHARTS_DIR = "charts"

# duração dos testes (definido nos scripts k6)
TEST_DURATION_SECONDS = 20

# formato de exibição
pd.options.display.float_format = "{:.5f}".format

os.makedirs(CHARTS_DIR, exist_ok=True)

# --------------------------------------------------
# Função para carregar NDJSON do K6 (REST, GraphQL, SOAP)
# --------------------------------------------------
def load_k6_metrics(filename):
    filepath = os.path.join(RESULTS_DIR, filename)

    latencies = []
    total_requests = 0

    with open(filepath) as f:
        for line in f:
            try:
                obj = json.loads(line.strip())
            except json.JSONDecodeError:
                continue

            metric = obj.get("metric")
            data = obj.get("data", {})
            data_type = data.get("type")

            # latência (ms)
            if metric == "http_req_duration" and data_type == "Point":
                val = data.get("value")
                if val is not None:
                    latencies.append(val)

            # contar requisições
            if metric == "http_reqs" and data_type == "Point":
                total_requests += 1

    if not latencies:
        return 0, 0, 0

    lat_sorted = sorted(latencies)
    avg = sum(latencies) / len(latencies)
    p95 = lat_sorted[int(0.95 * len(lat_sorted)) - 1]
    throughput = total_requests / TEST_DURATION_SECONDS

    return avg, p95, throughput


# --------------------------------------------------
# Função para extrair métricas do gRPC (ghz)
# --------------------------------------------------
def load_grpc_metrics(filename):
    filepath = os.path.join(RESULTS_DIR, filename)

    with open(filepath) as f:
        txt = f.read()

    # Média:
    avg_match = re.search(r"Average:\s*([0-9.]+)\s*ms", txt)

    # p95:
    p95_match = re.search(r"95 % in ([0-9.]+)\s*ms", txt)

    # throughput:
    reqs_match = re.search(r"Requests/sec:\s*([0-9.]+)", txt)

    if not avg_match or not p95_match or not reqs_match:
        print("\n❌ ERRO: não consegui extrair métricas do arquivo gRPC.\n")
        print(txt)
        return 0, 0, 0

    avg = float(avg_match.group(1))
    p95 = float(p95_match.group(1))
    throughput = float(reqs_match.group(1))

    return avg, p95, throughput


# ======================
# Carregar métricas
# ======================

rest_avg, rest_p95, rest_tput = load_k6_metrics("rest.json")
graphql_avg, graphql_p95, graphql_tput = load_k6_metrics("graphql.json")
soap_avg, soap_p95, soap_tput = load_k6_metrics("soap.json")
grpc_avg, grpc_p95, grpc_tput = load_grpc_metrics("grpc.txt")

labels = ["REST", "GraphQL", "SOAP", "gRPC"]

avg_values = [rest_avg, graphql_avg, soap_avg, grpc_avg]
p95_values = [rest_p95, graphql_p95, soap_p95, grpc_p95]
throughput_values = [rest_tput, graphql_tput, soap_tput, grpc_tput]

# ======================
# DataFrame final
# ======================

df = pd.DataFrame({
    "Tecnologia": labels,
    "Latência Média (ms)": avg_values,
    "Latência p95 (ms)": p95_values,
    "Throughput (req/s)": throughput_values
})

print("\n=== MÉTRICAS CARREGADAS ===")
print(df)
print("============================\n")

# ======================
# Gráfico — Latência Média
# ======================

plt.figure(figsize=(10, 6))
plt.bar(labels, avg_values, color="dodgerblue")
plt.title("Latência Média (ms)")
plt.ylabel("ms")
plt.ylim(0, max(avg_values) * 1.4)
plt.grid(axis="y", linestyle="--", alpha=0.6)
plt.savefig(os.path.join(CHARTS_DIR, "latencia_media.png"))
plt.close()

# ======================
# Gráfico — p95
# ======================

plt.figure(figsize=(10, 6))
plt.bar(labels, p95_values, color="orange")
plt.title("Latência p95 (ms)")
plt.ylabel("p95 (ms)")
plt.ylim(0, max(p95_values) * 1.4)
plt.grid(axis="y", linestyle="--", alpha=0.6)
plt.savefig(os.path.join(CHARTS_DIR, "latencia_p95.png"))
plt.close()

# ======================
# Gráfico — Throughput
# ======================

plt.figure(figsize=(10, 6))
plt.bar(labels, throughput_values, color="green")
plt.title("Throughput (req/s)")
plt.ylabel("req/s")
plt.ylim(0, max(throughput_values) * 1.4)
plt.grid(axis="y", linestyle="--", alpha=0.6)
plt.savefig(os.path.join(CHARTS_DIR, "throughput.png"))
plt.close()

print("🎉 Gráficos gerados com sucesso na pasta charts/")
