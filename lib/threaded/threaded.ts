import {Worker} from 'worker_threads'
import * as path from 'path'
import * as perfy from 'perfy'

import {workerInfo} from '../shared'
import xor, {decodeHex} from '../crypto'

// program vars
const MAXCLIENTS: number = parseInt(process.argv[2], 10) || 2
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
for (let i: number = 0; i < MAXCLIENTS; i++) {
	log(`initialising worker ${i}`)
	const workerData: workerInfo = {
		num: i,
		size: MAXCLIENTS,
		ciphertext: CIPHERTEXT
	}
	const worker = new Worker(WORKERFILE, {workerData})
	worker.on('message', (data) => {
		if (data.text === TEXT && data.key === KEY) {
			const end = process.hrtime(hrstart)
			// console.log(end)
			const ms = (end[0] * 1000) + (end[1] / 1000000)
			console.log(`Execution time (hr): ${ms}ms`)
			process.exit(0)
		}	
	})
	worker.on('error', err => {
		log('Error!')
		log(err)
		process.exit(1)
	})
}