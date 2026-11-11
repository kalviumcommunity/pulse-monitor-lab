# pulse-monitor-lab

A tiny containerized web service with a local monitoring stack (Prometheus + Grafana),
used for a DevOps practice exercise on production monitoring.

> ⚠️ **This repo is intentionally broken.** It ships with **three planted faults** —
> one for each task. The service becomes observable only after you fix all three.

## The app

A small **Node.js (Express)** server that listens on port **8080**.

| Route      | Expected behaviour                                             |
|------------|---------------------------------------------------------------|
| `GET /`        | returns `Pulse app is running` with HTTP **200**          |
| `GET /health`  | returns `{"status":"ok"}` with HTTP **200** when healthy  |
| `GET /metrics` | exposes Prometheus-format metrics on port **8080**        |

### Expected behaviour once fixed

- `/health` returns `{"status":"ok"}` with HTTP **200**.
- Logs are **one JSON object per line** with fields `timestamp`, `level`, `message`.
  Exactly one line is logged at `"level":"error"` during startup.
- `/metrics` is exposed on port **8080** and scraped by Prometheus.
- The Prometheus target for the app reads **UP** at http://localhost:9090/targets.

## Run it

```bash
docker compose up -d --build
```

Services:

- App: http://localhost:8080
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000

## Verifying a healthy, observable stack

After fixing the three faults, this sequence should succeed:

```bash
docker compose up -d --build
docker compose ps                                   # app is healthy
curl -s http://localhost:8080/health                # {"status":"ok"}
docker compose logs app | grep '"level":"error"'    # returns the one planted error line
curl -s http://localhost:8080/metrics | head        # Prometheus-format metrics
# http://localhost:9090/targets -> app target UP
```

## Your tasks

1. **Health check** — make `docker compose ps` report the app as `healthy`.
2. **Structured logging** — make logs valid one-line JSON so
   `grep '"level":"error"'` isolates the planted error line.
3. **Monitoring signal** — make the Prometheus app target read **UP**.

## Prerequisites and boundaries

Git, running Docker Engine with Compose v2, curl and internet access for images/npm dependencies. Reserve host ports 8080, 9090 and 3000. Commands run from repository root; Bash is needed for supplied traffic loops/scripts. No host Node.js installation, cloud account, billing or real credentials needed. Local monitoring interfaces are exercise-only; do not expose them on a public network. Repair only documented health, logging and monitoring faults; preserve existing service routes, controlled failures and metric semantics. Do not disable checks or fabricate log/metric output.

Wait for listeners, health probes and initial scrapes before interpreting results. After application/image changes run `docker compose up -d --build`; after mounted Prometheus/rule changes run `docker compose restart prometheus`. Local stack status does not prove notification delivery or production readiness.

Cleanup only exercise resources: `docker compose down`.
