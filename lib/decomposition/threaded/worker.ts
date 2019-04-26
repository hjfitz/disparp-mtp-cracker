import {workerData, parentPort} from 'worker_threads'
import {getWordList, isReadable} from '../../shared'
import xor, { decodeHex } from '../../crypto';

const {num, size, ciphertext} = workerData

const wordList: string[] = getWordList(num, size)
const decodedCT: string = decodeHex(ciphertext)
for (let i: number = 0; i < wordList.length; i++) {
	const candidate: string = wordList[i]
	const decoded: string = decodeHex(xor(decodedCT, candidate))
	if (isReadable(decoded) && parentPort) {
		parentPort.postMessage({text: decoded, key: candidate})
	}
}


