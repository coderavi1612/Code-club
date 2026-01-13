const express = require("express");
const {engine} = require('express-handlebars');
const path = require("path");
const app = express();
const port = 3000;

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
// app.set("views", "./views");

app.use(express.static(path.join(__dirname, "static")));
app.use("/", require(path.join(__dirname, "routes/blog.js")));
// app.get("/", (req, res) => {
// //   res.sendFile();
// });

app.get("/about", (req, res) => {
  // res.send('About');
  res.sendFile(path.join(__dirname, "index.html"));
  // res.status(500)
  // res.json({"Ravi":"Person"})
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
