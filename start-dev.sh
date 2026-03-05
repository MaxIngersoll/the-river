#!/bin/bash
export PATH="/usr/local/Cellar/node@20/20.20.0/bin:/usr/local/opt/node@20/bin:$PATH"
cd "$(dirname "$0")"
npx vite --host
