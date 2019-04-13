export const decode = text => [...text.match(/(0x)?[0-9A-Fa-f]{1,2}[\s,]*/g)].map((val) => String.fromCharCode(parseInt(val,16))).join('');

export const encode = text => text.split('').map(char => Number(char.charCodeAt(0)).toString(16)).map(hex => hex.length === 1 ? `0${hex}` : hex).join(' ')

// function xorStrings(text: string, key: string): string {
// 	const split: string[] = text.split('')

// }

const xorStrings = (a, b) => a.split('').map((achar, idx) => {
	const bchar = b[idx] || b[idx % b.length]
	return String.fromCharCode(achar.charCodeAt(0) ^ bchar.charCodeAt(0))
}).join('')

export default function xor(a, b) {
	if (a.length > b.length) return encode(xorStrings(a, b))
	return encode(xorStrings(b, a))
}


// ! usage
// const enc = xor('helloooo', 'world')
// const dec = decode(xor(decode(enc), 'world'))
// console.log({ enc, dec })