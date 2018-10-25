#!/bin/bash
set -o errexit
set -o pipefail

set_variables() {
    COMMIT_HASH=$(git rev-parse --short HEAD)

    if [ "$CIRCLE_BRANCH" == 'master' ]; then
        IMAGE_TAG=$COMMIT_HASH
        ENVIRONMENT=production
        GOOGLE_COMPUTE_ZONE=${PRODUCTION_GOOGLE_COMPUTE_ZONE}
        GOOGLE_CLUSTER_NAME=${PRODUCTION_CLUSTER_NAME}
    else
        IMAGE_TAG="${CIRCLE_BRANCH}-${COMMIT_HASH}"
        ENVIRONMENT=staging
        GOOGLE_COMPUTE_ZONE=${STAGING_GOOGLE_COMPUTE_ZONE}
        GOOGLE_CLUSTER_NAME=${STAGING_CLUSTER_NAME}
    fi
}

authorize_docker() {
    echo "====> Store Sand authenticate with service account"
    echo $GCLOUD_SERVICE_KEY | base64 --decode > ${HOME}/gcloud-service-key.json

    echo "====> Login to docker registry"


    docker login -u _json_key -p "$(cat ${HOME}/gcloud-service-key.json)" https://gcr.io
}

deploy_image() {

    echo ${FRONTEND_BASE_URL} ${SERVER_API_BASE_URL} ${G_SUITE_DOMAIN} ${ANDELA_API_BASE_URL} ${CLIENT_ID}
    cd client && yarn install

    export NODE_ENV=production

    yarn run build && cd ..

    make build_frontend

    make tagFrontend $IMAGE_TAG
    echo "$IMAGE_TAG ==>>>>>>>"

    make publishFrontend
}

install_google_cloud_sdk(){
    echo "====> Installing google cloud sdk"
    echo "deb http://packages.cloud.google.com/apt cloud-sdk-jessie main" | sudo tee /etc/apt/sources.list.d/google-cloud-sdk.list
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
    sudo apt-get update && sudo apt-get install kubectl google-cloud-sdk
}

configure_google_cloud_sdk() {
    echo "Configuring Google Cloud Sdk"
    gcloud auth activate-service-account --key-file=${HOME}/gcloud-service-key.json
    gcloud --quiet config set project ${GOOGLE_PROJECT_ID}
    gcloud --quiet config set compute/zone ${GOOGLE_COMPUTE_ZONE}
    gcloud --quiet container clusters get-credentials ${GOOGLE_CLUSTER_NAME}
}

deploy_to_kubernetes(){
     echo "====> Prepare image for deployement"

    IMAGE="${DOCKER_REGISTRY}/${GOOGLE_PROJECT_ID}/${FRONTEND_REPO_NAME}:${IMAGE_TAG}"
    echo ${FRONTEND_REPO_NAME}
    DEPLOYMENT_NAME="${ENVIRONMENT}-${FRONTEND_PROJECT_NAME}"
    echo "====> Deploying ${IMAGE} to ${DEPLOYMENT_NAME} in ${ENVIRONMENT} environment"


    kubectl set image deployment/${DEPLOYMENT_NAME} frontend=${IMAGE} -n "${ENVIRONMENT}"



    if [ "$?" == "0" ]; then
        echo "Deployment completed successfully"
    else
        echo "Failed to deploy ${IMAGE} to ${ENVIRONMENT} environment"
    fi

}

main() {
    set_variables
    authorize_docker
    deploy_image
    install_google_cloud_sdk
    configure_google_cloud_sdk
    deploy_to_kubernetes
}

main "$@"
