import express from 'express'
import https from 'https'
import { Server } from 'socket.io';
import Filter from 'bad-words'
import * as messages from './src/untils/messages.js'
import * as users from './src/untils/users.js'
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()
const server = https.createServer(app)
const io = new Server(server)


const PORT = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, './public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {
        const { error, user } = users.addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', messages.generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', messages.generateMessage(user.username + ' has joined!'))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: users.getUsersInRoom(user.room)
        })
        callback()
    })

    socket.on("messSend", (messValue, callback) => {
        const user = users.getUser(socket.id)
        const filter = new Filter();
        if (filter.isProfane(messValue))
            return callback('Profantity is not allowed!')
        io.to(user.room).emit('message', messages.generateMessage(user.username, messValue))
        callback()
    })

    socket.on("sendLocation", (location, callback) => {
        const user = users.getUser(socket.id)

        io.to(user.room).emit('locationMessage', messages.generateLocationMessage(user.username, 'https://www.google.com/maps?q=' + location.latitude + ',' + location.longtitude))
        callback()
    })
    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', messages.generateMessage('Admin', user.username + ' has left!'))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: users.getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(PORT, () => {
    console.log('Server is running on port', PORT)
})