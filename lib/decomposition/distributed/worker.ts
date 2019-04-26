import io from 'socket.io-client'
import {getWordList, isReadable, workerInfo} from '../../shared'
import xor, {decodeHex} from '../../crypto'

// program vars
const ADDR: string = process.argv[2] || 'http://localhost:5000'
// initialise websocket
const socket: any = io(ADDR)

const log = (...args) => console.log('> client', ...args)

console.log(isReadable("THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG'S BACK"))
// socket main loop
socket.on('begin', (data: workerInfo): void => {
	log('begin event recieved')
	const wordList: string[] = getWordList(data.num, data.size)
	const decodedCT: string = decodeHex(data.ciphertext)
	const hrstart = process.hrtime()
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
	log('scan complete')
	// process.exit(0)
})

log(`beginning session on ${ADDR}`)

