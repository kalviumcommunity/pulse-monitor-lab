const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = 8080;

// Prometheus metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });
const httpRequests = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["route"],
});
register.registerMetric(httpRequests);

// Simple logger — one event per line
function log(level, message) {
  console.log(`${level}: ${message}`);
}

// Startup: simulated recoverable warning promoted to error
log("error", "config file missing, using defaults");
log("info", "pulse-monitor starting up");

app.get("/", (req, res) => {
  httpRequests.inc({ route: "/" });
  log("info", "root requested");
  res.status(200).send("Pulse app is running");
});

app.get("/health", (req, res) => {
  httpRequests.inc({ route: "/health" });
  log("info", "health checked");
  res.status(500).json({ status: "down" });
});

app.get("/metrics", async (req, res) => {
  httpRequests.inc({ route: "/metrics" });
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, () => {
  log("info", `listening on ${PORT}`);
});
