#!/bin/sh
set -e

echo ">>> Starting propkart-presales container with Traefik integration..."
docker rm -f propkart-presales 2>/dev/null || true

docker run -d \
  --name propkart-presales \
  --restart unless-stopped \
  --network propconnect-network \
  -v /root/propconnect-stack/nginx-presales.conf:/etc/nginx/conf.d/default.conf:ro \
  -v /root/propconnect-stack/presales-dist:/usr/share/nginx/html:ro \
  -l "traefik.enable=true" \
  -l "traefik.http.routers.propkart-presales-live.rule=Host(\`presales.nbpropertytech.com\`) || Host(\`pre-sales.nblisting.com\`)" \
  -l "traefik.http.routers.propkart-presales-live.entrypoints=websecure" \
  -l "traefik.http.routers.propkart-presales-live.tls=true" \
  -l "traefik.http.routers.propkart-presales-live.tls.certresolver=letsencrypt" \
  -l "traefik.http.services.propkart-presales-live.loadbalancer.server.port=80" \
  nginx:alpine

echo ">>> propkart-presales container started successfully!"
