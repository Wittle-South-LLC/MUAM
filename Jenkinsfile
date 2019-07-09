// Eventually this needs to test everything, but initially lets start
// with the client tests running
pipeline {
  agent any
  stages {
    stage ('Build server image for test') {
      steps {
        sh 'docker build server -f server/Dockerfile --tag=registry.wittlesouth.com/muam:test'
        withCredentials([usernamePassword(credentialsId: 'registry.wittlesouth.com.credentials',
                         passwordVariable: 'REGISTRY_PWD',
                         usernameVariable: 'REGISTRY_USER')]) {
          sh "echo $REGISTRY_PWD | docker login --username $REGISTRY_USER --password-stdin"
        }
        sh 'docker push registry.wittlesouth.com/muam:test'
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
