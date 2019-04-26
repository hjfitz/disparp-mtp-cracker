import {getWordList, isReadable} from '../shared'
import xor, {decodeHex} from '../crypto'

// program vars
const TEXT: string = "THE QUICK BROWN FOX JUMPED OVER THE LAZY DOG'S BACK"
const KEY: string = 'tritonymph'
const CIPHERTEXT: string = xor(TEXT, KEY)
const log: Function = (...args) => console.log('[sequential] >', ...args)

log('Beginning sequential brute-force')

const hrstart = process.hrtime()
const wordList: string[] = getWordList(0, 1)
const decodedCT: string = decodeHex(CIPHERTEXT)
for (let i: number = 0; i < wordList.length; i++) {
	const candidate: string = wordList[i]
	const decoded: string = decodeHex(xor(decodedCT, candidate))
	if (isReadable(decoded)) {
		if (decoded === TEXT && candidate === KEY) {
			const end = process.hrtime(hrstart)
			const ms = (end[0] * 1000) + (end[1] / 1000000)
			log(`Execution time (hr): ${ms}ms`)
			process.exit(0)
		}
	}
}
