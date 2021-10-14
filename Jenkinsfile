node {
    def server = Artifactory.server 'jfrog'
    def rtNpm = Artifactory.newNpmBuild()
    def buildInfo

    stage('clone') {
        git branch: 'testing', credentialsId: 'gitHub', url: 'https://github.com/themagnit/TDB-GlobalUtils.git'
    }

    stage ('Artifactory configuration') {
        rtNpm.deployer repo: 'tdb_globalutils-npm', server: server
        rtNpm.resolver repo: 'tdb_globalutils-npm', server: server
        // Tool name from Jenkins configuration
        rtNpm.tool = 'npm'
        buildInfo = Artifactory.newBuildInfo()
    }

    stage ('Install npm') {
        rtNpm.install buildInfo: buildInfo
    }

    stage ('Publish npm') {
        rtNpm.publish buildInfo: buildInfo
    }

    stage ('Publish build info') {
        server.publishBuildInfo buildInfo
    }
}