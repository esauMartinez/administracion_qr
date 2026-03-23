pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        PROJECT_NAME = 'administracion_qr'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Clonando repositorio desde GitHub...'
                checkout scm
            }
        }

        stage('Environment Info') {
            steps {
                echo '🔍 Información del entorno...'
                sh '''
                    echo "Node version: $(node --version || echo 'Node no instalado')"
                    echo "NPM version: $(npm --version || echo 'NPM no instalado')"
                    echo "Docker version: $(docker --version)"
                    echo "Docker Compose version: $(docker-compose --version)"
                '''
            }
        }

        stage('Stop Previous Containers') {
            steps {
                echo '🛑 Deteniendo contenedores anteriores...'
                sh '''
                    docker-compose -f ${DOCKER_COMPOSE_FILE} down || true
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🔨 Construyendo imagen Docker...'
                sh '''
                    docker-compose -f ${DOCKER_COMPOSE_FILE} build --no-cache
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Desplegando aplicación...'
                sh '''
                    docker-compose -f ${DOCKER_COMPOSE_FILE} up -d
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '✅ Verificando despliegue...'
                sh '''
                    sleep 10
                    docker-compose -f ${DOCKER_COMPOSE_FILE} ps
                    docker-compose -f ${DOCKER_COMPOSE_FILE} logs --tail=50
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Despliegue exitoso! La aplicación está disponible en http://localhost:3500'
        }
        failure {
            echo '❌ El despliegue falló. Revisando logs...'
            sh 'docker-compose -f ${DOCKER_COMPOSE_FILE} logs --tail=100'
        }
        always {
            echo '🧹 Limpiando imágenes antiguas...'
            sh 'docker image prune -f || true'
        }
    }
}
