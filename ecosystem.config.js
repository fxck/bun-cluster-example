module.exports = {
  apps: [{
    name: process.env.APP_NAME || "bun-app",
    script: "./dist/app.js",
    interpreter: "bun",
    interpreter_args: "",
    exec_mode: "fork",
    instances: "max",
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
