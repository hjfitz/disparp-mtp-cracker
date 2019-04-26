import {workerData, parentPort} from 'worker_threads'
import {getWordList, isReadable} from '../../shared'
import xor, { decodeHex } from '../../crypto';

const {num, size, ciphertext, wordList} = workerData

function brute(wordList) {
	const decodedCT: string = decodeHex(ciphertext)
	for (let i: number = 0; i < wordList.length; i++) {
		const candidate: string = wordList[i]
		const decoded: string = decodeHex(xor(decodedCT, candidate))
		// console.log({candidate})
		if (isReadable(decoded) && parentPort) {
			console.log({decoded, candidate})
			parentPort.postMessage({text: decoded, key: candidate})
		}
	}
	if (parentPort) parentPort.postMessage('next')
}



if (parentPort) {
	brute(wordList)
	parentPort.on('message', (wordList) => {
		brute(wordList)
	})
}