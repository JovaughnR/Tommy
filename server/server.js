const express = require("express");
const app = express();
const fs = require("fs");
const info = fs.readFileSync('./public/data/data.json');
const Data = JSON.parse(info);

const PORT = 3000 || process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}.`);
})


app.use(express.static('./public'));
app.use(express.json({limit: '1mb'}));

app.get('/data', (request, response) => {
    response.send(Data);
});

app.get('/search/:tag', (request, response) => {
    let data = request.params;
    for (var i = 0; i < Data.intents.length; i ++ ) {
        if (Data.intents[i].tag === data.tag) {
            response.send({
                tag: data.tag,
                status: "found",
                index : i,
                patterns: Data.intents[i].patterns
            })
        }
        else if (i == (Data.intents.length - 1)) {
            response.send({
                tag: data.tag,
                status: "not found",
            });
            break;
        }
    }
})

app.post('/name', (request, response) => {
    console.log(request.body);
    Data.intents.push({
        tag: request.body.tag,
        patterns: request.body.patterns,
        responses: request.body.responses
    })
    const info = JSON.stringify(Data, null, 4);
    fs.writeFileSync('./data.json', info)
    response.send("JSON DATA RECEIEVED");
});


app.post('/')


// This is the chatbot that i created.




// That is the chatbot that i created it is really smart..
























// const path = require('path');
// const express = require('express');
// const http = require('http');
// const socketio = require('socket.io');

// const app = express();

// // console.log(app);
// const server = http.createServer(app);
// // console.log(server)
// const io = socketio(server);

// const users = {};

// // console.log(io)
// io.on('connection', socket => {
//     console.log('New Ws Connection...');

//     socket.on('new-user', username => {
//         users[socket.id] = username;
//         socket.broadcast.emit('user-connected', username);
//     })

//     //Welcome current user
//     socket.emit('message','welcome to chatbord');

//     //broadcast when uer connect
//     socket.broadcast.emit('message', 'A user has join the chat');
//     socket.on('send-chat-message', message => {
//         // console.log(message);
//         socket.broadcast.emit(message)
//     });

//     // runs when client disconnects
//     socket.on('disconnects', () => {
//         io.emit('message', 'A user has left the chat');
//     });
// });

// const PORT = 3000 || process.env.PORT;
// // console.log(PORT);
// server.listen(PORT);






// const path = require('path');
// const express = require('express');
// const socketio = require('socket.io');
// const http = require('http');
// const port = 5500 || process.env.PORT;
// const app = express();
// const server = http.createServer(app);
// const io = socketio(server);

// //MiddleWares
// app.use(express.json());
// app.use(
//   express.urlencoded({
//     extended: false,
//   })
// );
// app.use("/static", express.static('./static/'));
// app.use(express.static(__dirname + '/public'));

// app.get('/', (req, res) => {
//   res.sendFile('index.html');
// });

// io.on('connect', (socket) => {
// console.log('New user joined');
// });

// server.listen(port, () => {
//   console.log(`App has been started at port ${port}`);
// });