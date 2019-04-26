import {Worker} from 'worker_threads'
import * as path from 'path'

import {getWordListFarm} from '../../shared'
import xor from '../../crypto'

// program vars
const MAXCLIENTS: number = parseInt(process.argv[2], 10) || 2
const BLOCKSIZE: number = 65536
const TEXT: string = "THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG'S BACK"
const KEY: string = 'tritonymph'
const CIPHERTEXT: string = xor(TEXT, KEY)
// horrible hack... wait until this is compiled to JS and then load worker
// which is also compiled to JS
const WORKERFILE: string = path.join(__dirname, 'worker.js') 
const log: Function = (...args) => console.log('[main thread] >', ...args)

log(`beginning multi-threaded mtp brute-force with ${MAXCLIENTS} threads`)
log(`loading ${WORKERFILE}`)


const hrstart = process.hrtime()
let blockStart: number = 0;
for (let i: number = 0; i < MAXCLIENTS; i++) {
	log(`initialising worker ${i}`)
	const wordList: string[] = getWordListFarm(blockStart, BLOCKSIZE)
	blockStart += BLOCKSIZE
	const workerData = {
		num: i,
		size: MAXCLIENTS,
		ciphertext: CIPHERTEXT,
		wordList,
	}
	// calaulate wordList for each worker
	const worker = new Worker(WORKERFILE, {workerData})
	worker.on('message', (data) => {
		if (data === 'next') {
			const nextList: string[] = getWordListFarm(blockStart, BLOCKSIZE)
			blockStart += BLOCKSIZE
			worker.postMessage(nextList)
		} else if (data.text === TEXT && data.key === KEY) {
			console.log('candidate found: ' + data.text + ' key: ' + data.key)
			const end = process.hrtime(hrstart)
			const ms = (end[0] * 1000) + (end[1] / 1000000)
			console.log(`Execution time (hr): ${ms}ms`)
			process.exit(0)
		} else {

		}
	})
	worker.on('error', err => {
		log('Error!')
		log(err)
		process.exit(1)
	})
}