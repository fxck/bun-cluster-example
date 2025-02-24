import cluster from 'node:cluster';
import os from 'node:os';
import { serve } from "bun";

// Configuration
const CONFIG = {
  port: parseInt(process.env.PORT || '3000'),
  workers: parseInt(process.env.WORKERS || '', 10) || os.cpus().length,
  appName: process.env.APP_NAME || 'bun-app',
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Primary process - spawn workers
if (cluster.isPrimary) {
  console.log(`🚀 ${CONFIG.appName} primary starting with ${CONFIG.workers} workers`);
  console.log(`⚡ Server will be accessible on port ${CONFIG.port}`);

  // Fork workers based on configuration
  for (let i = 0; i < CONFIG.workers; i++) {
    cluster.fork();
  }

  // Handle worker events
  cluster.on('exit', (worker, code, signal) => {
    console.log(`⚠️ Worker ${worker.id} died (${signal || code}). Restarting...`);
    cluster.fork();
  });

  // Log when workers come online
  cluster.on('online', (worker) => {
    console.log(`✅ Worker ${worker.id} is online (PID: ${worker.process.pid})`);
  });

  // Display application info
  console.log(`
  🌐 ${CONFIG.appName}
  📊 Environment: ${CONFIG.nodeEnv}
  🧵 Workers: ${CONFIG.workers}
  🔌 Port: ${CONFIG.port}
  `);
}

// Worker process - handle requests
else {
  const workerId = cluster.worker?.id || 0;

  console.log(`Worker ${workerId} starting (PID: ${process.pid})`);

  serve({
    port: CONFIG.port, // All workers bind to the same port!
    fetch(req) {
      const url = new URL(req.url);

      if (url.pathname === "/") {
        return new Response(
          `Hello from ${CONFIG.appName}! ` +
          `Running on worker ${workerId} ` +
          `(PID: ${process.pid}) in ${CONFIG.nodeEnv} mode`, {
          headers: { "Content-Type": "text/plain" },
        });
      }

      if (url.pathname === "/info") {
        return new Response(JSON.stringify({
          app: CONFIG.appName,
          worker: workerId,
          pid: process.pid,
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          cpu: process.cpuUsage()
        }, null, 2), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (url.pathname === "/health") {
        return new Response("OK", {
          headers: { "Content-Type": "text/plain" },
        });
      }

      return new Response("Not Found", { status: 404 });
    },
  });

  console.log(`Worker ${workerId} listening on http://localhost:${CONFIG.port}`);
}
