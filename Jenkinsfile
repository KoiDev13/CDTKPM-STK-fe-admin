pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t 192.168.1.101:5000/cdtkpmnc-admin .'
                sh 'docker push 192.168.1.101:5000/cdtkpmnc-admin'
                sh 'docker rmi 192.168.1.101:5000/cdtkpmnc-admin'
                sh 'docker image prune -f'
            }
        }
        stage('Deploy') {
            steps {
                sshagent(credentials: ['ssh_key']) {
                      sh 'ssh -o StrictHostKeyChecking=no -l root 192.168.1.101 sh /root/build-script/cdtkpmnc-admin.sh'
                    }
                }
            }
        }
    }
