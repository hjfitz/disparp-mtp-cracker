import io from 'socket.io-client'
import {getWordList, isReadable, workerInfo} from './shared'
import xor, {decodeHex} from './crypto'

// program vars
const ADDR: string = process.argv[2] || 'http://localhost:5000'
// initialise websocket
const socket: any = io(ADDR)

const log = (...args) => console.log('> client', ...args)

console.log(isReadable("THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG'S BACK"))
// socket main loop
socket.on('begin', (data: workerInfo) => {
	log('begin event recieved')
	const wordList: string[] = getWordList(data.num, data.size)
	const decodedCT: string = decodeHex(data.ciphertext)
	for (let i: number = 0; i < wordList.length; i++) {
		const candidate: string = wordList[i]
		const decoded: string = decodeHex(xor(decodedCT, candidate))
		if (isReadable(decoded)) {
			socket.emit('candidate', {text: decoded, key: candidate})
			console.log({candidate, decoded})
		}
	}
	log('scan complete')
})

log(`beginning session on ${ADDR}`)

