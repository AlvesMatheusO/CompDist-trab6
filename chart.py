import json
from pathlib import Path
import matplotlib.pyplot as plt
import numpy as np
import re

# ---------------------------------------------------------
# PARSER DO K6 (REST / GraphQL / SOAP)
# ---------------------------------------------------------

def load_k6_linejson(filepath: Path):
    durations = []
    reqs = 0

    with open(filepath) as f:
        for line in f:
            obj = json.loads(line)

            # latências
            if obj.get("metric") == "http_req_duration" and obj["type"] == "Point":
                durations.append(obj["data"]["value"])

            # quantidade de requests
            if obj.get("metric") == "http_reqs" and obj["type"] == "Point":
                reqs += 1

    avg = np.mean(durations) if durations else 0
    p95 = np.percentile(durations, 95) if durations else 0

    return avg, p95, reqs


# ---------------------------------------------------------
# PARSER DO gRPC (arquivo texto do ghz)
# ---------------------------------------------------------

def load_grpc(path: Path):
    text = path.read_text()

    avg_match = re.search(r"Average:\s*([0-9.]+)\s*ms", text)
    grpc_avg = float(avg_match.group(1)) if avg_match else 0.0

    p95_match = re.search(r"95\s*%\s*in\s*([0-9.]+)\s*ms", text)
    grpc_p95 = float(p95_match.group(1)) if p95_match else 0.0

    tput_match = re.search(r"Requests/sec:\s*([0-9.]+)", text)
    grpc_tput = float(tput_match.group(1)) if tput_match else 0.0

    return grpc_avg, grpc_p95, grpc_tput


# ---------------------------------------------------------
# CARREGAR ARQUIVOS
# ---------------------------------------------------------

results = Path("results")

rest_avg, rest_p95, rest_reqs = load_k6_linejson(results / "rest.json")
graphql_avg, graphql_p95, graphql_reqs = load_k6_linejson(results / "graphql.json")
soap_avg, soap_p95, soap_reqs = load_k6_linejson(results / "soap.json")

grpc_avg, grpc_p95, grpc_tput = load_grpc(results / "grpc.txt")

print("gRPC Avg:", grpc_avg)
print("gRPC P95:", grpc_p95)
print("gRPC TPS:", grpc_tput)

# throughput REST/GraphQL/SOAP = número de requests
rest_tput = rest_reqs
graphql_tput = graphql_reqs
soap_tput = soap_reqs

labels = ["REST", "GraphQL", "SOAP", "gRPC"]
avgs = [rest_avg, graphql_avg, soap_avg, grpc_avg]
p95s = [rest_p95, graphql_p95, soap_p95, grpc_p95]
throughputs = [rest_tput, graphql_tput, soap_tput, grpc_tput]


# ---------------------------------------------------------
# GRÁFICOS
# ---------------------------------------------------------

Path("charts").mkdir(exist_ok=True)

plt.figure(figsize=(10,6))
plt.bar(labels, avgs)
plt.title("Latência Média (ms)")
plt.ylabel("ms")
plt.savefig("charts/latencia_media.png")

plt.figure(figsize=(10,6))
plt.bar(labels, p95s)
plt.title("Latência p95 (ms)")
plt.ylabel("ms")
plt.savefig("charts/latencia_p95.png")

plt.figure(figsize=(10,6))
plt.bar(labels, throughputs)
plt.title("Throughput (req/s)")
plt.ylabel("req/s")
plt.savefig("charts/throughput.png")

print("Gráficos gerados com sucesso!")
