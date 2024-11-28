const express=require('express');
const app=express();
const http=require('http');
const path = require('path');

const socketio=require('socket.io');

const server=http.createServer(app);

const io=socketio(server);

app.get('/',(req,res)=>{
    res.send('Hello World');
});

app.set('view engine','ejs');
app.set(express.static(path.join(__dirname,'public')));

server.listen(3000,()=>{
    console.log(`Server is running on port ${3000}`);
})   