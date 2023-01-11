const express = require('express');
const server = express();

server.all('/', (req, res)=>{
   res.setHeader('Content-Type', 'text/html');
   res.write('<h1>[STATUS]: Ready</h1>');
   res.end();
})

function keepAlive(){
   server.listen(3000, ()=>{console.log("[SERVER]: Online")});
}

module.exports = keepAlive;