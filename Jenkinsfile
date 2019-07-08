// Eventually this needs to test everything, but initially lets start
// with the client tests running
pipeline {
  agent any
  stages {
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
