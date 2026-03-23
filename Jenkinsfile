pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        PROJECT_NAME = 'administracion_qr'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📥 Clonando repositorio desde GitHub...'
                git branch: 'main',
                    url: 'https://github.com/esauMartinez/administracion_qr.git'
            }
        }

        stage('Environment Info') {
            steps {
                echo '🔍 Información del entorno...'
                sh '''
                    echo "Node version: $(node --version || echo 'Node no instalado')"
                    echo "NPM version: $(npm --version || echo 'NPM no instalado')"
                    echo "Docker version: $(docker --version)"
                    echo "Docker Compose version: $(sudo docker compose version || echo 'Docker Compose no disponible')"
                '''
            }
        }

        stage('Stop Previous Containers') {
            steps {
                echo '🛑 Deteniendo contenedores anteriores...'
                sh '''
                    sudo docker compose -f ${DOCKER_COMPOSE_FILE} down || true
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                echo '🔨 Construyendo imagen Docker...'
                sh '''
                    sudo docker compose -f ${DOCKER_COMPOSE_FILE} build --no-cache
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Desplegando aplicación...'
                sh '''
                    sudo docker compose -f ${DOCKER_COMPOSE_FILE} up -d
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo '✅ Verificando despliegue...'
                sh '''
                    sleep 10
                    sudo docker compose -f ${DOCKER_COMPOSE_FILE} ps
                    sudo docker compose -f ${DOCKER_COMPOSE_FILE} logs --tail=50
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
            sh 'sudo docker compose -f ${DOCKER_COMPOSE_FILE} logs --tail=100'
        }
        always {
            echo '🧹 Limpiando imágenes antiguas...'
            sh 'docker image prune -f || true'
        }
    }
}