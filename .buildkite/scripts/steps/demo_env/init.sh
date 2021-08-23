#!/usr/bin/env bash

set -euo pipefail

source "$(dirname "${0}")/config.sh"

"$(dirname "${0}")/auth.sh"

echo '--- Import and publish Elasticsearch image'

mkdir -p target

export ES_IMAGE="gcr.io/elastic-kibana-184716/demo/elasticsearch:$DEPLOYMENT_NAME-$(git rev-parse HEAD)"

DOCKER_EXPORT_URL=$(curl https://storage.googleapis.com/kibana-ci-es-snapshots-daily/$DEPLOYMENT_VERSION/manifest-latest-verified.json | jq -r '.archives | .[] | select(.platform=="docker") | .url')
curl "$DOCKER_EXPORT_URL" > target/elasticsearch-docker.tar.gz
docker load < target/elasticsearch-docker.tar.gz
docker tag "docker.elastic.co/elasticsearch/elasticsearch:$DEPLOYMENT_VERSION-SNAPSHOT" "$ES_IMAGE"
docker push "$ES_IMAGE"

echo '--- Prepare yaml'

TEMPLATE=$(envsubst < "$(dirname "${0}")/init.yml")

echo "$TEMPLATE"

echo '--- Deploy yaml'
echo "$TEMPLATE" | kubectl apply -f -
