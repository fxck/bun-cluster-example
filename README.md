# Zerops x Bun running through PM2

```yaml
project:
  name: bun-cluster-example

services:
  - hostname: buncluster
    type: bun@1.2
    buildFromGit: https://github.com/fxck/bun-cluster-example
    enableSubdomainAccess: true
```
