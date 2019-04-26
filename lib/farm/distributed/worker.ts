import io from 'socket.io-client'
import {getWordList, isReadable, workerInfo} from '../../shared'
import xor, {decodeHex} from '../../crypto'

// program vars
const ADDR: string = process.argv[2] || 'http://localhost:5000'
// initialise websocket
const socket: any = io(ADDR)

const log = (...args) => console.log('> client', ...args)
let hrstart 
let decodedCT: string

console.log(isReadable("THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG'S BACK"))

function brute(wordList) {
	for (let i: number = 0; i < wordList.length; i++) {
		const candidate: string = wordList[i]
		const decoded: string = decodeHex(xor(decodedCT, candidate))
		if (isReadable(decoded)) {
			const end = process.hrtime(hrstart)
			socket.emit('candidate', {text: decoded, key: candidate})
			console.log({candidate, decoded})
			const ms = (end[0] * 1000) + (end[1] / 1000000)
			console.log(`Execution time (hr): ${ms}ms`)
		}
	}
}

// socket main loop
socket.on('begin', (data): void => {
	log('begin event recieved')
	hrstart = process.hrtime()
	decodedCT = decodeHex(data.ciphertext)
	brute(data.wordList)
	socket.emit('next-list')
	// log('scan complete')
	// process.exit(0)
})

socket.on('list', (wordList: string[]) => {
	brute(wordList)
	socket.emit('next-list')
})
socket.on('die', () => process.exit(0))

log(`beginning session on ${ADDR}`)

