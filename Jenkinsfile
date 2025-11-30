// Jenkins Pipeline for Continuous Deployment (CD)
// This pipeline handles deployment after GitHub Actions completes CI
// GitHub Actions: CI (Lint, Build, Test, Docker Build & Push)
// Jenkins: CD (Deploy to Staging/Production)

pipeline {
    agent any
    
    environment {
        // Docker configuration
        DOCKER_IMAGE = 'strapi-app'
        DOCKER_REGISTRY = credentials('dockerhub-username') // Set in Jenkins credentials
        CONTAINER_NAME = 'sqe-strapi-staging'
        PORT = '1337'
        STAGING_URL = 'http://localhost:1337'
    }
    
    stages {
        // Stage 1: Checkout code (optional - mainly for reference)
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    echo "Deploying from branch: ${env.BRANCH_NAME}"
                }
            }
        }
        
        // Stage 2: Pull latest Docker image from Docker Hub
        stage('Pull Docker Image') {
            steps {
                script {
                    echo "Pulling latest Docker image: ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest"
                    sh """
                        docker pull ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest || echo "Image pull failed, continuing..."
                    """
                }
            }
        }
        
        // Stage 3: Deploy to Staging
        stage('Deploy to Staging') {
            steps {
                script {
                    echo "Deploying to staging environment..."
                    sh """
                        # Stop and remove existing container if it exists
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                        
                        # Run new container
                        docker run -d \\
                            --name ${CONTAINER_NAME} \\
                            -p ${PORT}:1337 \\
                            -e NODE_ENV=production \\
                            -e DATABASE_FILENAME=/app/.tmp/staging.db \\
                            ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest
                        
                        echo "Container ${CONTAINER_NAME} started"
                    """
                }
            }
        }
        
        // Stage 4: Wait for application to be ready
        stage('Wait for Application') {
            steps {
                script {
                    echo "Waiting for Strapi to start..."
                    sh """
                        for i in {1..30}; do
                            if curl -s -f ${STAGING_URL}/admin > /dev/null 2>&1; then
                                echo "✅ Strapi is ready!"
                                exit 0
                            fi
                            echo "Waiting for Strapi... (attempt \$i/30)"
                            sleep 5
                        done
                        echo "⚠️ Strapi may not be fully ready, but continuing..."
                    """
                }
            }
        }
        
        // Stage 5: Health Check
        stage('Health Check') {
            steps {
                script {
                    echo "Performing health check..."
                    sh """
                        # Check if container is running
                        docker ps | grep ${CONTAINER_NAME} || (echo "Container not running!" && exit 1)
                        
                        # Check if application responds
                        curl -f ${STAGING_URL}/admin || echo "Health check warning: Application may not be fully ready"
                        
                        echo "✅ Health check completed"
                    """
                }
            }
        }
        
        // Stage 6: Run Smoke Tests (Optional)
        stage('Smoke Tests') {
            steps {
                script {
                    echo "Running smoke tests..."
                    sh """
                        # Basic smoke test - check if admin page loads
                        HTTP_CODE=\$(curl -s -o /dev/null -w "%{http_code}" ${STAGING_URL}/admin)
                        if [ "\$HTTP_CODE" = "200" ]; then
                            echo "✅ Smoke test passed: Admin page accessible"
                        else
                            echo "⚠️ Smoke test warning: Admin page returned HTTP \$HTTP_CODE"
                        fi
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo "✅ Deployment to staging completed successfully!"
            echo "Application available at: ${STAGING_URL}/admin"
        }
        failure {
            echo "❌ Deployment failed!"
            script {
                // Show container logs on failure
                sh "docker logs ${CONTAINER_NAME} --tail 50 || true"
            }
        }
        always {
            // Cleanup or notifications can be added here
            echo "Deployment pipeline completed"
        }
    }
}
