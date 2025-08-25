#!/bin/sh

# Tạo file config.js chứa biến env từ container runtime
cat <<EOF > /usr/share/nginx/html/config.js
window.__ENV__ = {
  VITE_API_BASE_URL: "${VITE_API_BASE_URL}"
}
EOF

exec "$@"
