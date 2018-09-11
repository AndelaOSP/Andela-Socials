#!/usr/bin/env bash
BOLD='\e[1m'
BLUE='\e[34m'
RED='\e[31m'
YELLOW='\e[33m'
GREEN='\e[92m'
NC='\e[0m'


info() {
    printf "\n${BOLD}${BLUE}====> $(echo $@ ) ${NC}\n"
}

warning () {
    printf "\n${BOLD}${YELLOW}====> $(echo $@ )  ${NC}\n"
}

error() {

    printf "\n${BOLD}${RED}====> $(echo $@ )  ${NC}\n"
    exit 1
}

success () {
    printf "\n${BOLD}${GREEN}====> $(echo $@ ) ${NC}\n"
}

is_success_or_fail() {
    if [ "$?" == "0" ]; then success $@; else error $@; fi
}

is_success() {
    if [ "$?" == "0" ]; then success $@; fi
}

# require "variable name" "value"
require () {
    if [ -z ${2+x} ]; then error "Required variable ${1} has not been set"; fi
}


installGoogleCloudSdk(){
    info "Installing google cloud sdk"
    echo "deb http://packages.cloud.google.com/apt cloud-sdk-jessie main" | sudo tee /etc/apt/sources.list.d/google-cloud-sdk.list
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
    sudo apt-get update && sudo apt-get install kubectl google-cloud-sdk
    is_success "Gcloud and Kubecl has been installed successfully"
}

getCommitHash() {
    local __commitVariable=$1
    local __commitHashValue=$(git rev-parse --short HEAD)
    if [ "$__commitVariable" ]; then
        eval $__commitVariable="'$__commitHashValue'";
     else
        echo $__commitHashValue;
    fi
}

# setEnvironment <branch name>
setEnvironment () {
    local __branchName=$1
    if [ "$__branchName" == 'master' ]; then
        export ENVIRONMENT=production
        export GOOGLE_COMPUTE_ZONE=$PRODUCTION_GOOGLE_COMPUTE_ZONE
        export GOOGLE_CLUSTER_NAME=$PRODUCTION_CLUSTER_NAME
    else
        export ENVIRONMENT=staging
        export GOOGLE_COMPUTE_ZONE=$STAGING_GOOGLE_COMPUTE_ZONE
        export GOOGLE_CLUSTER_NAME=$STAGING_CLUSTER_NAME
    fi
    export NAMESPACE=$ENVIRONMENT
}

# getImageTag "commit"
getImageTag() {
    require "BRANCH_NAME" $BRANCH_NAME
    local __commitHashValue=$1

    if [ "$BRANCH_NAME" == 'master' ]; then
        local imageTag=$__commitHashValue
    else
        local imageTag="staging-${__commitHashValue}"
    fi
    echo "$imageTag"
}

#  getDeploymentName DEPLOYMENT_NAME
getDeploymentName() {
    require ENVIRONMENT $ENVIRONMENT
    require PROJECT_NAME $PROJECT_NAME

    local __depoymentNameVariable=$1
    local __deploymentName="${ENVIRONMENT}-${PROJECT_NAME}"
    if [[ "$__depoymentNameVariable" ]]; then
        eval $__depoymentNameVariable="'$__deploymentName'"
    else
        echo "$__deploymentName"
    fi
}

# loginToContainerRegistry <username> <auth path>
loginToContainerRegistry () {
    require 'DOCKER_REGISTRY' $DOCKER_REGISTRY
    info "Login to $DOCKER_REGISTRY container registry"
    local __username=$1
    local __authPasswordPath=$2
    if [ "$__authPasswordPath" ]; then
        AUTH_PASSWORD_PATH=$__authPasswordPath
    else
        require 'GCLOUD_SERVICE_KEY_NAME' $GCLOUD_SERVICE_KEY_NAME
        local AUTH_PASSWORD_PATH="${HOME}/${GCLOUD_SERVICE_KEY_NAME}"
    fi
    is_success_or_fail $(docker login -u  $__username --password-stdin https://${DOCKER_REGISTRY} < $AUTH_PASSWORD_PATH)
}

# logoutContainerRegistry <container registry name>
logoutContainerRegistry() {
    local __dockerRegistry=$1
    if [ "$__dockerRegistry}" ]; then
        is_success_or_fail $(docker logout https://${__dockerRegistry})
    else
        error "Required argument docker registry has not been passed: Usage --> logoutContainerRegistry <container registry name>"
    fi
}

# getImageName 'repository name'
# use google project id for GCR and docker id or username for dockerhub
getImageName() {
    local __imageRepository=$1

    require 'DOCKER_REGISTRY' $DOCKER_REGISTRY
    require 'IMAGE_TAG' $IMAGE_TAG
    require 'PROJECT_NAME' $PROJECT_NAME

    if [ "$__imageRepository" ]; then
        GOOGLE_PROJECT_ID=$__imageRepository
    else
        require 'GOOGLE_PROJECT_ID' $GOOGLE_PROJECT_ID
    fi

    echo "${DOCKER_REGISTRY}/${GOOGLE_PROJECT_ID}/${PROJECT_NAME}:${IMAGE_TAG}"
}
# buildAndTagDockerImage args
buildAndTagDockerImage() {
    require "IMAGE_NAME" $IMAGE_NAME
    info "Building image with tag $IMAGE_NAME ....."
    docker build -t $IMAGE_NAME $@
}

publishDockerImage () {

    local __imageName=$1
    if [ "$__imageName" ]; then
        IMAGE=$__imageName
    else
        require "IMAGE_NAME" $IMAGE_NAME
        IMAGE=$IMAGE_NAME
    fi
    info "Publish docker image $IMAGE to container registry"
    docker push $IMAGE
}

deployToKubernetesCluster() {
    local __containerName=$1
    local __namespace=$2
    if [ "$__namespace" ]; then
        NAMESPACE=$__namespace
    else
        require "NAMESPACE" $NAMESPACE
    fi
    require "DEPLOYMENT_NAME" $DEPLOYMENT_NAME
    require "IMAGE_NAME" $IMAGE_NAME
    require "ENVIRONMENT" $ENVIRONMENT
    require "GOOGLE_CLUSTER_NAME" $GOOGLE_CLUSTER_NAME

    info "Deploying image $IMAGE to $ENVIRONMENT environment on $GOOGLE_CLUSTER_NAME cluster"

    kubectl set image deployment/$DEPLOYMENT_NAME $__containerName=$IMAGE_NAME --namespace $NAMESPACE

    if [ "$?" == "0" ]; then
        success "Image ${IMAGE_NAME} was successfuly deployed to ${ENVIRONMENT} environment"
        exit 0
    else
        error "Failed to deploy ${IMAGE} to ${ENVIRONMENT} environment"
        exit 1
    fi
}

authWithServiceAccount() {
    local __serviceKeyName=$1

    if [ "$__serviceKeyName"]; then
        GCLOUD_SERVICE_KEY_NAME=$__serviceKeyName
    else
        require 'GCLOUD_SERVICE_KEY_NAME' $GCLOUD_SERVICE_KEY_NAME
    fi
    local __serviceKeyPath=${HOME}/$GCLOUD_SERVICE_KEY_NAME
    require 'GCLOUD_SERVICE_KEY' $GCLOUD_SERVICE_KEY
    echo $GCLOUD_SERVICE_KEY | base64 --decode > $__serviceKeyPath
    gcloud auth activate-service-account --key-file $__serviceKeyPath
    is_success "Service account activated successfuly"
}

configureGoogleCloudSdk() {
    local __serviceKeyName=$1

    if [ "$__serviceKeyName" ]; then
        GCLOUD_SERVICE_KEY_NAME=$__serviceKeyName
    else
        require 'GCLOUD_SERVICE_KEY_NAME' $GCLOUD_SERVICE_KEY_NAME
    fi
    require 'GOOGLE_PROJECT_ID' $GOOGLE_PROJECT_ID
    require 'GOOGLE_COMPUTE_ZONE' $GOOGLE_COMPUTE_ZONE
    require 'GOOGLE_CLUSTER_NAME' $GOOGLE_CLUSTER_NAME
    gcloud --quiet config set project ${GOOGLE_PROJECT_ID}
    gcloud --quiet config set compute/zone ${GOOGLE_COMPUTE_ZONE}
    gcloud --quiet container clusters get-credentials ${GOOGLE_CLUSTER_NAME}
    is_success "Configuration completed successfully"
}

isAllowedDeployEnvironment() {
    local __environment=$1
    require 'ALLOWED_DEPLOY_ENVIRONMENTS' $ALLOWED_DEPLOY_ENVIRONMENTS
    [ -z $(echo ${ALLOWED_DEPLOY_ENVIRONMENTS[@]} | grep -o $__environment) ] && error "$__environment is not an allowed deployment environment"
    success "Setting up deployments for $__environment environment"
}

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
