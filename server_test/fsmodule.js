const fs = require('fs');

// fs.readFile('file.txt','utf8', (err, data)=>{
//     console.log(err, data)
// })

// const a = fs.readFileSync('file.txt')
// console.log(a.toString())


fs.writeFile('file2.txt', "This is the content", () => {
    console.log("Written")
});
console.log("Finish reading file")