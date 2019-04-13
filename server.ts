import http from 'http'
import socketIO from 'socket.io'
import * as perfy from 'perfy'
import debug from 'debug'
import xor, {decode} from './crypto'

const d: debug.Debugger = debug('disparp:server')

const MAXCLIENTS: number = 4
const TEXT: string = "THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG'S BACK"
const KEY: string = 'polyhaemic'
const CIPHERTEXT: string = xor(TEXT, KEY)

// const decoded = decode(xor(decode(CIPHERTEXT), KEY))
// console.log(decoded)

const server: http.Server = http.createServer()
const io: socketIO.Server = socketIO(server, { path: '/', serveClient: false })


io.on('connection', (socket: socketIO.Socket) => {
	console.log('socket get' + socket.id)
})


server.listen(8080)
server.on('listening', () => {
	debug('server up and running on localhost:8080')
})

