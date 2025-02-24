// app.ts with PM2 clustering support
import { serve } from "bun";

// Get environment variables with type safety
const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_NAME: process.env.APP_NAME || 'bun-app',
  PORT: parseInt(process.env.PORT || '3000'),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  MAX_MEMORY_LIMIT: parseInt(process.env.MAX_MEMORY_LIMIT || '512'),
  ENABLE_METRICS: process.env.ENABLE_METRICS === 'true',
  // Get the PM2 instance ID, defaulting to 0 if not running in PM2
  PM2_ID: parseInt(process.env.pm_id || '0')
};

// Only the first instance (ID 0) or non-PM2 environments will bind to the main port
// Other instances will use offset ports (not exposed externally)
const instancePort = process.env.pm_id ? (ENV.PORT + parseInt(process.env.pm_id)) : ENV.PORT;

console.log(`Starting ${ENV.APP_NAME} in ${ENV.NODE_ENV} mode`);
console.log(`Worker ID: ${process.env.pm_id || 'standalone'}, PID: ${process.pid}`);
console.log(`Binding to port: ${instancePort} (main port: ${ENV.PORT})`);

serve({
  port: instancePort,
  fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response(
        `Hello from ${ENV.APP_NAME}! ` +
        `Running on worker ${process.env.pm_id || 'standalone'} ` +
        `(PID: ${process.pid}) in ${ENV.NODE_ENV} mode`, {
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (url.pathname === "/env" && ENV.NODE_ENV !== 'production') {
      // Only expose in non-production environments
      return new Response(JSON.stringify(ENV, null, 2), {
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

console.log(`Bun server running on http://localhost:${instancePort}`);
