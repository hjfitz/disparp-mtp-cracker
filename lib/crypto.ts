// export const decode = text => [...text.match(/(0x)?[0-9A-Fa-f]{1,2}[\s,]*/g)].map((val) => String.fromCharCode(parseInt(val,16))).join('');
// export const encode = text => text.split('').map(char => Number(char.charCodeAt(0)).toString(16)).map(hex => hex.length === 1 ? `0${hex}` : hex).join(' ')

export function decodeHex(hex: string): string {
	// split in to hex digraphs
	const matchArr: string[] | null = hex.match(/(0x)?[0-9A-Fa-f]{1,2}[\s,]*/g)
	// map over array, parse to hex number and then to String
	const decoded: string[] = (matchArr || []).map((val) => String.fromCharCode(parseInt(val,16)))
	return decoded.join('')
}

export function encodeHex(str: string): string {
	const split: string[] = str.split('')
	const digraphs: string[] = split
		.map(char => Number(char.charCodeAt(0)).toString(16))
		.map(hex => hex.length === 1 ? `0${hex}` : hex)
	return digraphs.join(' ')
}


function xorStrings(text: string, key: string): string {
	// split the string to loop over
	const wordsplit: string[] = text.split('')
	const keylen: number = key.length
	const xorList: string[] = wordsplit.map((char: string, idx: number): string => {
		// use mod so as to repeat the key
		const keyChar: string = key[idx % keylen]
		// xor individual char codes
		const xorChar: number = char.charCodeAt(0) ^ keyChar.charCodeAt(0)
		// convert char code to string
		return String.fromCharCode(xorChar)
	})
	return xorList.join('')
}

export default function xor(word1: string, word2: string): string {
	if (word1.length > word2.length) {
		return encodeHex(xorStrings(word1, word2))
	}
	return encodeHex(xorStrings(word2, word1))
}

// ! usage
// const enc = xor('helloooo', 'world')
// const dec = decode(xor(decode(enc), 'world'))
// console.log({ enc, dec })