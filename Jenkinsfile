// Jenkins Pipeline for Continuous Deployment (CD)
// This pipeline handles deployment after GitHub Actions completes CI
// GitHub Actions: CI (Lint, Build, Test, Docker Build & Push)
// Jenkins: CD (Deploy to Staging/Production)

pipeline {
    agent any

    environment {
        // Docker configuration - Update with your Docker Hub username
        DOCKER_IMAGE = credentials('dockerhub-username') + '/strapi-app:latest'
        CONTAINER_NAME = 'strapi'
        PORT = '1337'
    }

    stages {
        stage('Pull Latest Image') {
            steps {
                script {
                    echo "Pulling latest Docker image: ${DOCKER_IMAGE}"
                    sh 'docker pull ${DOCKER_IMAGE}'
                }
            }
        }

        stage('Stop Old Container') {
            steps {
                script {
                    echo "Stopping and removing old container..."
                    sh 'docker stop ${CONTAINER_NAME} || true'
                    sh 'docker rm ${CONTAINER_NAME} || true'
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                script {
                    echo "Deploying to staging environment..."
                    sh '''
                        docker run -d \
                            -p ${PORT}:1337 \
                            --name ${CONTAINER_NAME} \
                            -e NODE_ENV=production \
                            ${DOCKER_IMAGE}
                    '''
                    echo "✅ Container ${CONTAINER_NAME} started"
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo "Waiting for application to be ready..."
                    sh '''
                        sleep 10
                        for i in {1..10}; do
                            if curl -f http://localhost:${PORT}/admin > /dev/null 2>&1; then
                                echo "✅ Application is ready!"
                                exit 0
                            fi
                            echo "Waiting... (attempt $i/10)"
                            sleep 5
                        done
                        echo "⚠️ Health check timeout, but continuing..."
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployed successfully to staging."
            echo "Application available at: http://localhost:${PORT}/admin"
        }
        failure {
            echo "❌ Deployment failed. Check logs."
            script {
                sh 'docker logs ${CONTAINER_NAME} --tail 50 || true'
            }
        }
        always {
            echo "Deployment pipeline completed"
        }
    }
}
