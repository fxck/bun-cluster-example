// PM2 configuration using CommonJS format for maximum compatibility
module.exports = {
  apps: [{
    name: process.env.APP_NAME || "bun-app",
    script: "./dist/app.js",  // Using relative path with explicit extension
    interpreter: "bun",
    instances: "max", // Use all available CPUs
    exec_mode: "cluster",
    max_memory_restart: "500M",
    exp_backoff_restart_delay: 100,
    kill_timeout: 3000,
    listen_timeout: 8000,
    merge_logs: true,
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    env: {
      PM2_SERVE_PORT: process.env.PORT || 3000,
      PM2_LOG_LEVEL: process.env.LOG_LEVEL || 'info'
    }
  }]
}
