// Eventually this needs to test everything, but initially lets start
// with the client tests running
pipeline {
  agent any
  stages {
    stage ('Set up local python environment') {
      steps {
        sh "virtualenv --python=/usr/bin/python3 server"
        sh ". server/bin/activate && pip3 install -r server/requirements.txt"
      }
    }
    stage ('Build server image for test') {
      steps {
        sh 'pip --version'
        sh 'docker build --help'
        withCredentials([usernamePassword(credentialsId: 'pypi.wittlesouth.com',
                         passwordVariable: 'REGISTRY_PWD', usernameVariable: 'REGISTRY_USER')]) {
          sh "docker build --build-arg REGISTRY_PWD=$REGISTRY_PWD --build-arg REGISTRY_USER=$REGISTRY_USER -f server/Dockerfile --tag=registry.wittlesouth.com/muam:test server"
        }
        withCredentials([usernamePassword(credentialsId: 'registry.wittlesouth.com.credentials',
                         passwordVariable: 'REGISTRY_PWD',
                         usernameVariable: 'REGISTRY_USER')]) {
          sh "echo $REGISTRY_PWD | docker login --username $REGISTRY_USER --password-stdin registry.wittlesouth.com"
        }
        sh 'docker push registry.wittlesouth.com/muam:test'
      }
    }
    stage ('Deploy server for testing') {
      steps {
        sh "helm install muam --name muam-${env.BUILD_ID}"
      }
    }
    stage ('Run client tests') {
      environment {
        NODE_ENV = 'test'
      }
      steps {
        dir ('web') {
          sh "npm --version"
          sh "npm config set cache /tmp"
          withCredentials([string(credentialsId: 'FontAwesomePro', variable: 'NPM_TOKEN')]) {
            sh "npm config set \"@fortawesome:registry\" https://npm.fontawesome.com/"
            sh "npm config set \"//npm.fontawesome.com/:_authToken\" ${NPM_TOKEN}"
          }
          sh "npm ci"
          sh "npm test"
        }
      }
    }
  }
  post {
    failure {
      mail to: 'eric@wittlesouth.com',
      subject: "WS Failed Pipeline: ${currentBuild.fullDisplayName}",
      body: "Build failed: ${env.BUILD_URL}"
    }
    always {
      deleteDir()
    }
  }
}
