import io from 'socket.io-client';
import xor, { decode } from './crypto'

const socket = io(window.location.host);

socket.on('begin', (data) => {
	// const response = crack()
})