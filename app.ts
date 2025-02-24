import { serve } from "bun";

// Get environment variables with type safety
const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  APP_NAME: process.env.APP_NAME || 'bun-app',
  PORT: parseInt(process.env.PORT || '3000'),
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  MAX_MEMORY_LIMIT: parseInt(process.env.MAX_MEMORY_LIMIT || '512'),
  ENABLE_METRICS: process.env.ENABLE_METRICS === 'true'
};

console.log(`Starting ${ENV.APP_NAME} in ${ENV.NODE_ENV} mode`);
console.log(`Environment configuration: ${JSON.stringify(ENV, null, 2)}`);

const server = serve({
      port: ENV.PORT,
  fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response(`Hello from ${ENV.APP_NAME}! Running on worker ${process.pid} in ${ENV.NODE_ENV} mode`, {
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

console.log(`Bun server running on http://localhost:${server.port}`);
