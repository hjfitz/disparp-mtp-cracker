import fs from 'fs'
import path from 'path'

import io from 'socket.io-client'

// import xor, { decode } from './crypto'

// program vars
let me: number
const WORDFILE: string = path.join(__dirname, 'words_alpha.txt')
const ADDR: string = process.argv[2] || 'http://localhost:8080'
// initialise websocket
const socket: any = io(ADDR)
// socket events
socket.on('begin', (data) => {

})

/**
 * gets a list of words to test
 * @param me our place
 * @param peerCount amount of peers, so we know where to begin and end in the wordfile
 */
function getWordList(me: number, size: number): string[] {
	// open file and parse to string
	const contents: string = fs.readFileSync(WORDFILE).toString()
	// split so it's iterable
	const splitByLine: string[] = contents.split('\n')

	const fileLength: number = splitByLine.length

	// [1] https://moodle.port.ac.uk/pluginfile.php/850990/mod_resource/content/23/week17-lab.html
	const blockSize: number = Math.floor(fileLength / size)
	const begin: number = me * blockSize
	const end: number = begin + blockSize
	console.log({blockSize, begin, end})
	const listSlice: string[] = splitByLine.slice(begin, end)
	return listSlice
}

/**
 * use an RE to check if text is readable
 * @param text check if this is readable
 */
function isReadable(text: string): boolean {
	const REGEX: RegExp = new RegExp(/^[a-zA-Z0-9\., \'\"\-_\:\(\)]+$/)
	return REGEX.test(text)
}
