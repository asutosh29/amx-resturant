const express = require('express');

const app = express()
PORT = 8080

app.get('/',(req,res)=>{
    res.end("Home route")
})


app.listen(PORT, ()=>{console.log(`Server started at PORT: ${PORT}`)})