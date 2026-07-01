#!/usr/bin/env bash
# Rebuild the site and (re)start the production server on port 3000.
set -euo pipefail
cd "$(dirname "$0")"

# Kill any existing process on port 3000
fuser -k 3000/tcp || true

# Start the production server
setsid nohup bun run start > /home/team/shared/prod-x-platform/server.log 2>&1 < /dev/null &
echo "platform published; serving on port 3000"
