module.exports = {
    apps: [
        {
            name: "geosint",
            script: "server.js",
        },
        {
            name: "process",
            script: "process.js",
            args: "continuous"
        },
        {
            name: "pull",
            script: "pull_challs.js",
            args: "continuous"
        }
    ]
}