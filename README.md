# Zerops x Bun running through PM2

```yaml
project:
  name: bun-pm2-example

services:
  - hostname: pm2bun
    type: bun@1.2
    buildFromGit: https://github.com/fxck/bun-pm2-example
    enableSubdomainAccess: true
```
