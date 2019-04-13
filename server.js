const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 5000

io.on('connection', socket => {
	console.log(`socket ${socket.id} connected`)
})

app.use(express.static(path.join(__dirname, 'public')))

server.listen(port, () => {
	console.log(`Server listening on ${port}`)
})