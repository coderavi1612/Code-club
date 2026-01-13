const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// const raviMiddleWare = (req, res, next) =>{
//     console.log(req);
//     next();
// }

app.use(express.static(path.join(__dirname, "public")))
// app.use(raviMiddleWare)
app.get('/hello/:name', (req,res) =>{
    res.send('Hello World! ' + req.params.name);
})

app.get('/about', (req, res) =>{
    // res.send('About');
    res.sendFile(path.join(__dirname, 'index.html'))
    // res.status(500)
    // res.json({"Ravi":"Person"})
})

app.listen(port, () =>{
    console.log(`Server is listening on port ${port}`)
})