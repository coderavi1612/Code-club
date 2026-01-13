const http = require("http");
const fs = require("fs");

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // console.log(req);

  console.log(req.url);
  res.setHeader("Content-Type", "text/html");
  if (req.url == "/") {
    res.statusCode = 200;
    res.end("<h1>Hello</h1><p>Hey there!</p>");
  } else if (req.url == "/about") {
    res.statusCode = 200;
    res.end("<h1>About </h1><p>Hey there! this is about page</p>");
  } else if (req.url == "/hello") {
    res.statusCode = 200;
   const data =  fs.readFileSync('index.html')
    res.end(data);
  } else {
    try {
      req.ravi();
    } catch (e) {
      console.log(e);
    }
    res.statusCode = 404;
    res.end(`<h1>Not Found </h1><p>Hey there! this page doesn't exist</p>`);
  }
});

server.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
