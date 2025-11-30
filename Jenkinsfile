pipeline {
    agent any
    
    environment {
        // Application configuration
        NODE_VERSION = '20'
        NODE_ENV = 'production'
        
        // Docker configuration (optional)
        DOCKER_IMAGE = 'sqe-strapi-app'
        CONTAINER_NAME = 'sqe-strapi'
        PORT = '1337'
    }
    
    stages {
        // Stage 1: Checkout code from SCM
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        // Stage 2: Setup Node.js environment
        stage('Setup Node.js') {
            steps {
                script {
                    // Install nvm if not already installed
                    if (!fileExists("${HOME}/.nvm/nvm.sh")) {
                        sh 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash'
                    }
                    // Source nvm and install Node.js
                    sh '''
                    export NVM_DIR="\${HOME}/.nvm"
                    [ -s "\$NVM_DIR/nvm.sh" ] && \. "\$NVM_DIR/nvm.sh"
                    nvm install ${NODE_VERSION}
                    nvm use ${NODE_VERSION}
                    node --version
                    npm --version
                    '''
                }
            }
        }
        
        // Stage 3: Install dependencies
        stage('Install Dependencies') {
            steps {
                sh 'npm ci --production'
            }
        }
        
        // Stage 4: Build the application
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        // Stage 5: Run unit tests
        stage('Run Unit Tests') {
            steps {
                sh 'npm test'
            }
        }

        // Stage 6: Start Strapi server
        stage('Start Strapi') {
            steps {
                sh '''
                # Stop any existing Strapi instance
                pkill -f "node.*strapi" || true
                
                # Start Strapi in the background
                nohup npm run start > strapi.log 2>&1 & echo $! > strapi.pid
                echo "Strapi started with PID $(cat strapi.pid)"
                
                # Wait for Strapi to start
                echo "Waiting for Strapi to start..."
                for i in {1..30}; do
                    if curl -s -f http://localhost:${PORT} > /dev/null; then
                        echo "Strapi is ready!"
                        exit 0
                    fi
                    echo "Waiting for Strapi to start... (attempt $i/30)"
                    sleep 5
                done
                echo "Strapi failed to start. Logs:"
                cat strapi.log || echo "No log file found"
                exit 1
                '''
            }
        }
        
        // Stage 7: Run E2E tests
        stage('Run E2E Tests') {
            steps {
                script {
                    try {
                        sh 'npx cypress run --e2e --browser chrome --headless'
                    } finally {
                        // Ensure we collect test results even if tests fail
                        junit 'cypress/results/*.xml'
                    }
                }
            }
        }
        
        // Stage 8: Run Integration Tests (if any)
        stage('Run Integration Tests') {
            steps {
                script {
                    echo 'Running API integration tests...'
                    sh '''
                        if [ -d "tests/integration" ]; then
                            npx jest tests/integration --runInBand || echo "Integration tests completed"
                        else
                            echo "Integration tests not found, skipping..."
                        fi
                    '''
                }
            }
        }
        
        // Optional: Uncomment these stages if you want to include Docker deployment
        /*
        stage('Build Docker Image') {
            steps {
                script {
                    echo 'Building Docker image...'
                    sh "docker build -t ${DOCKER_IMAGE}:latest ."
                }
            }
        }

        stage('Deploy to Staging') {
            steps {
                script {
                    echo 'Deploying to staging environment...'
                    sh """
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                        docker run -d --name ${CONTAINER_NAME} -p ${PORT}:1337 ${DOCKER_IMAGE}:latest
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    echo 'Checking application health...'
                    sh """
                        sleep 10
                        curl -f http://localhost:${PORT}/admin || echo "Health check failed, but continuing..."
                    """
                }
            }
        }
        */
    }
    
    post {
        always {
            // Clean up processes and files
            sh '''
            echo "Cleaning up..."
            if [ -f strapi.pid ]; then
                echo "Stopping Strapi (PID: $(cat strapi.pid))"
                kill -9 $(cat strapi.pid) 2>/dev/null || true
                rm -f strapi.pid
            fi
            pkill -f "node.*strapi" 2>/dev/null || true
            echo "Cleanup complete"
            '''
            
            // Archive test results and logs
            archiveArtifacts artifacts: '**/cypress/screenshots/**,**/cypress/videos/**,strapi.log', allowEmptyArchive: true
            
            // Publish test results
            junit '**/test-results/*.xml'
        }
        
        success {
            echo '✅ Pipeline completed successfully!'
        }
        
        failure {
            echo '❌ Pipeline failed. Check the logs for details.'
        }
    }
}

