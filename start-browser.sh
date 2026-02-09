#!/bin/bash
# Start Chrome with remote debugging for Narralink

PROFILE_DIR="/home/ubuntu/.browser-profiles/shopee"
CDP_PORT=9222

# Create profile dir if not exists
mkdir -p "$PROFILE_DIR"

# Kill existing chrome on the port
pkill -f "chrome.*$CDP_PORT" 2>/dev/null || true

# Start chrome with remote debugging
google-chrome-stable \
  --remote-debugging-port=$CDP_PORT \
  --user-data-dir="$PROFILE_DIR" \
  --no-first-run \
  --no-default-browser-check \
  --disable-popup-blocking \
  --disable-translate \
  --disable-background-networking \
  --disable-sync \
  --disable-default-apps \
  --mute-audio \
  --disable-dev-shm-usage \
  --no-sandbox \
  --headless=new \
  --disable-gpu \
  "https://shopee.com" &

echo "Chrome started on port $CDP_PORT"
echo "VNC: http://localhost:8081/vnc.html"
