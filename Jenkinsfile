pipeline {
  agent any

  options {
    timeout(time: 30, unit: 'MINUTES')
  }

  parameters {
    choice(
      name: 'SCRIPT',
      choices: ['webTests', 'regression', 'APITests', 'azureWebTests', 'azureRegression'],
      description: 'npm script from package.json to run'
    )
  }

  environment {
    CI = 'true'
    PLAYWRIGHT_SERVICE_URL = 'wss://eastus.api.playwright.microsoft.com/playwrightworkspaces/4284e4bb-d325-40bc-afcd-7d5709a8eede/browsers'
  }

  stages {
    stage('Install') {
      steps {
        bat 'call npm ci'
      }
    }

    stage('Test') {
      steps {
        withCredentials([
          string(credentialsId: 'azure-client-id', variable: 'AZURE_CLIENT_ID'),
          string(credentialsId: 'azure-tenant-id', variable: 'AZURE_TENANT_ID'),
          string(credentialsId: 'azure-client-secret', variable: 'AZURE_CLIENT_SECRET')
        ]) {
          bat 'if exist allure-results rmdir /s /q allure-results'
          bat 'call npm run %SCRIPT%'
        }
      }
    }
  }

  post {
    always {
      bat 'if exist allure-results call npx allure generate allure-results --clean -o allure-report'
      archiveArtifacts artifacts: 'playwright-report/**, allure-report/**', allowEmptyArchive: true
    }
  }
}