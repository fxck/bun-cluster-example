export default {
  apps: [{
    name: process.env.APP_NAME || "bun-app",
    script: "dist/app.js",
    interpreter: "bun",
    instances: "max", // Use all available CPUs
    exec_mode: "cluster",
    max_memory_restart: `${process.env.MAX_MEMORY_LIMIT || 500}M`,
    exp_backoff_restart_delay: 100,
    kill_timeout: 3000,
    listen_timeout: 8000,
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",

    // PM2 will inherit environment variables from the OS
    // No need to redefine them, they're already available from Zerops

    // You can add PM2-specific env vars not defined in Zerops if needed
    env: {
      PM2_SERVE_PORT: process.env.PORT || 3000,
      PM2_LOG_LEVEL: process.env.LOG_LEVEL || 'info'
    }
  }]
}
