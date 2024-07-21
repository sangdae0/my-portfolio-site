// https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module

const port = 3000;

const http = require("http");
const fs = require('fs').promises;

const host = 'localhost';

// https://stackoverflow.com/a/38829194
resolve = require('path').resolve;

let indexHtmlFile;
let resumeHtmlFile;
let projectsHtmlFile;
let bsptreeWebHtmlFile;


const requestListener = function (req, res) {
    switch(req.url) {
        case "/projects":
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(projectsHtmlFile);
            break;
        case "/main_tree":
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(bsptreeWebHtmlFile);
            break;
        case "/":
            res.setHeader("Content-Type", "text/html");
            res.writeHead(200);
            res.end(indexHtmlFile);
            break;
        default:
            if (req.url.endsWith(".js")) {
                // https://stackoverflow.com/a/56285824
                fs.readFile(resolve(__dirname + "/" + req.url))
                .then(contents => {
                    res.setHeader("Content-Type", "text/javascript");
                    res.writeHead(200);
                    res.end(contents);
                    return;
                })
                .catch(err => {
                    console.error(`Could not read js file: ${err}`);
                    process.exit(1);    
                });
            } else if (req.url.endsWith(".frag") || req.url.endsWith(".vert")) {
                // https://stackoverflow.com/a/56285824
                fs.readFile(resolve(__dirname + "/" + req.url))
                .then(contents => {
                    res.setHeader("Content-Type", "text");
                    res.writeHead(200);
                    res.end(contents);
                    return;
                })
                .catch(err => {
                    console.error(`Could not read shader file: ${err}`);
                    process.exit(1);    
                });
            } else if (req.url.endsWith(".css")) {
                // https://stackoverflow.com/a/56285824
                fs.readFile(resolve(__dirname + "/" + req.url))
                .then(contents => {
                    res.setHeader("Content-Type", "text/css");
                    res.writeHead(200);
                    res.end(contents);
                    return;
                })
                .catch(err => {
                    console.error(`Could not read shader file: ${err}`);
                    process.exit(1);    
                });
            } else {
                res.write(req.url);
                res.end();
                break;
            }
    }
};



fs.readFile(__dirname + "/index.html")
    .then(contents => {
        indexHtmlFile = contents;
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });

fs.readFile(__dirname + "/projects.html")
    .then(contents => {
        projectsHtmlFile = contents;
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });

fs.readFile(__dirname + "/main_tree.html")
    .then(contents => {
        bsptreeWebHtmlFile = contents;
    })
    .catch(err => {
        console.error(`Could not read main_tree.html file: ${err}`);
        process.exit(1);
    });

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});