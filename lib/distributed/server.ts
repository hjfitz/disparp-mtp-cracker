import http from 'http'
import socketIO from 'socket.io'
import * as perfy from 'perfy'

import {workerInfo} from '../shared'
import xor, {decodeHex} from '../crypto'

const HTTPPORT: number = 5000
const MAXCLIENTS: number = parseInt(process.argv[2], 10) || 2
const TEXT: string = "THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG'S BACK"
const KEY: string = 'polyhaemic'
const CIPHERTEXT: string = xor(TEXT, KEY)

// const decoded = decodeHex(xor(decodeHex(CIPHERTEXT), KEY))
// console.log({CIPHERTEXT, decoded})

const server: http.Server = http.createServer()
const io: socketIO.Server = socketIO(server, { path: '/', serveClient: false })

console.log(`beginning distributed session expecting ${MAXCLIENTS} nodes`)

io.on('connection', (socket: socketIO.Socket): void => {
	console.log(`socket connected: ${socket.id}`)
	const totalConnected: number = Object.keys(io.sockets.sockets).length
	console.log(`total conected: ${totalConnected}`)

	// kick off distributed programming
	if (totalConnected === MAXCLIENTS) {
		perfy.start('brute')
		const sockets: socketIO.Socket[] = Object.values(io.sockets.sockets)
		for (let i: number = 0; i < sockets.length; i++) {
			const workerData: workerInfo = {
				num: i,
				size: sockets.length,
				ciphertext: CIPHERTEXT,
			}
			sockets[i].emit('begin', workerData)
		}
		console.log('total clients reached, beginning distributed connection')
	}
	socket.on('candidate', (data): void => {
		console.log(data)
		if (data.text === TEXT && data.key === KEY) {
			const result = perfy.end('brute')
			console.log('took: ' + result.milliseconds + 'ms')
			process.exit(0)
		}
	})
})


// launch a HTTP server to facilitate websocket server
server.listen(HTTPPORT)
server.on('listening', () => console.log(`server up and running on localhost:${HTTPPORT}`))

