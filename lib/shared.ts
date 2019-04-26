import * as fs from 'fs'
import * as path from 'path'

const WORDFILE: string = path.join(process.cwd(), 'lib', 'words_alpha.txt')

export interface workerInfo {
	num: number;
	size: number;
	ciphertext: string;
}

/**
 * gets a list of words to test
 * @param me our place
 * @param peerCount amount of peers, so we know where to begin and end in the wordfile
 */
export function getWordList(me: number, size: number): string[] {
	// open file and parse to string
	const contents: string = fs.readFileSync(WORDFILE).toString()
	// split so it's iterable
	const splitByLine: string[] = contents.split('\n')
	const fileLength: number = splitByLine.length
	// find blocksize and begin/end points
	const blockSize: number = Math.floor(fileLength / size)
	const begin: number = me * blockSize
	const end: number = begin + blockSize
	// split in to blocks, remove line endings and trim strings
	const listSlice: string[] = splitByLine
		.slice(begin, end)
		.map(word => word.replace(/\r/g, '').trim())
	return listSlice
}

export function getWordListFarm(blockStart: number, blockSize: number): string[] {
	// open file and parse to string
	const contents: string = fs.readFileSync(WORDFILE).toString()
	// split so it's iterable
	const splitByLine: string[] = contents.split('\n')
	const fileLength: number = splitByLine.length
	// split in to blocks, remove line endings and trim strings
	const listSlice: string[] = splitByLine
		.slice(blockStart, blockStart + blockSize)
		.map(word => word.replace(/\r/g, '').trim())
	return listSlice
}

/**
 * use an RE to check if text is readable
 * @param text check if this is readable
 */
export function isReadable(text: string): boolean {
	const REGEX: RegExp = new RegExp(/^[a-zA-Z0-9\., \'\"\-_\:\(\)]+$/)
	return REGEX.test(text)
}
