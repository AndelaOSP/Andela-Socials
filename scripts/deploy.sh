#!/usr/bin/env bash

set -eo pipefail

DEPLOY_SCRIPT_PATH="${HOME}/deploy"

curl -o $DEPLOY_SCRIPT_PATH https://raw.githubusercontent.com/AndelaOSP/bash-helper-modules/master/k8s/deploy

source $DEPLOY_SCRIPT_PATH

DOCKER_REGISTRY=gcr.io
GCLOUD_SERVICE_KEY_NAME=gcloud-service-key.json
ALLOWED_DEPLOY_ENVIRONMENTS=('staging' 'production')

require 'PRODUCTION_GOOGLE_COMPUTE_ZONE' $PRODUCTION_GOOGLE_COMPUTE_ZONE
require 'STAGING_GOOGLE_COMPUTE_ZONE' $STAGING_GOOGLE_COMPUTE_ZONE
require 'STAGING_CLUSTER_NAME' $STAGING_CLUSTER_NAME
require 'PRODUCTION_CLUSTER_NAME' $PRODUCTION_CLUSTER_NAME
require 'PROJECT_NAME' $PROJECT_NAME
require 'GOOGLE_PROJECT_ID' $GOOGLE_PROJECT_ID
require 'DOCKER_REGISTRY' $DOCKER_REGISTRY
require 'GCLOUD_SERVICE_KEY' $GCLOUD_SERVICE_KEY

BRANCH_NAME=$CIRCLE_BRANCH
setEnvironment $BRANCH_NAME
isAllowedDeployEnvironment $ENVIRONMENT

getDeploymentName DEPLOYMENT_NAME
IMAGE_TAG=$(getImageTag $(getCommitHash))
IMAGE_NAME=$(getImageName)
# export node environment variable
export NODE_ENV=$ENVIRONMENT

main() {
    installGoogleCloudSdk
    authWithServiceAccount
    configureGoogleCloudSdk
    loginToContainerRegistry _json_key
    make build_backend
    make tag $IMAGE_TAG
    make publish
    logoutContainerRegistry $DOCKER_REGISTRY
    deployToKubernetesCluster backend staging
}

main
