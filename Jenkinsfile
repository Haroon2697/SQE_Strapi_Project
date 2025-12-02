pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE_BACKEND = "${DOCKERHUB_USERNAME}/saleor-backend:latest"
        DOCKER_IMAGE_STOREFRONT = "${DOCKERHUB_USERNAME}/saleor-storefront:latest"
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
    }
    
    stages {
        stage('Pull Latest Images') {
            steps {
                script {
                    sh '''
                        echo "Pulling latest Docker images..."
                        docker pull ${DOCKER_IMAGE_BACKEND} || true
                        docker pull ${DOCKER_IMAGE_STOREFRONT} || true
                    '''
                }
            }
        }
        
        stage('Stop Old Containers') {
            steps {
                script {
                    sh '''
                        echo "Stopping old containers..."
                        docker stop saleor-backend saleor-storefront || true
                        docker rm saleor-backend saleor-storefront || true
                    '''
                }
            }
        }
        
        stage('Deploy to Staging') {
            steps {
                script {
                    sh '''
                        echo "Deploying to staging..."
                        
                        # Start backend
                        docker run -d \
                            --name saleor-backend \
                            -p 8000:8000 \
                            --env-file .env.staging \
                            ${DOCKER_IMAGE_BACKEND}
                        
                        # Start storefront
                        docker run -d \
                            --name saleor-storefront \
                            -p 3000:3000 \
                            -e NEXT_PUBLIC_SALEOR_API_URL=http://localhost:8000/graphql/ \
                            ${DOCKER_IMAGE_STOREFRONT}
                        
                        echo "Waiting for services to be ready..."
                        sleep 30
                        
                        # Health check
                        curl -f http://localhost:8000/health || exit 1
                        curl -f http://localhost:3000 || exit 1
                    '''
                }
            }
        }
        
        stage('Smoke Tests') {
            steps {
                script {
                    sh '''
                        echo "Running smoke tests..."
                        # Test backend GraphQL endpoint
                        curl -X POST http://localhost:8000/graphql/ \
                            -H "Content-Type: application/json" \
                            -d '{"query": "{ products(first: 1) { edges { node { id name } } } }"}' \
                            || exit 1
                        
                        # Test storefront
                        curl -f http://localhost:3000 || exit 1
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo "Deployment to staging successful!"
            emailext (
                subject: "✅ Saleor Deployment Successful",
                body: "Deployment to staging completed successfully.\n\nBuild: ${env.BUILD_NUMBER}\nCommit: ${env.GIT_COMMIT}",
                to: "${env.EMAIL_RECIPIENTS}"
            )
        }
        failure {
            echo "Deployment to staging failed!"
            emailext (
                subject: "❌ Saleor Deployment Failed",
                body: "Deployment to staging failed.\n\nBuild: ${env.BUILD_NUMBER}\nCommit: ${env.GIT_COMMIT}\n\nCheck Jenkins logs for details.",
                to: "${env.EMAIL_RECIPIENTS}"
            )
        }
    }
}
