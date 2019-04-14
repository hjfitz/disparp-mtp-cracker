# Distributed Systems and Parallel Programming [DISPARP]
> University of Portsmouth, Year 3 Coursework

## Many-time Pad Reuse brute-forcing
This repo has code for both a distributed and parallel (via worker_threads) for breaking ciphertexts enciphered using OTP and a repeated dictionary work as a key.

## Requirements
Only Node and NPM are required to use this program. The dictionary is given (although you can replace this!)
* Node: >= 11
* NPM: >= 6.4.1
* Yarn (preferred over NPM): >= 1.12.3

## Usage
0. Install all dependencies `npm install`
1. Build the TypeScript source code to JS: `npm run build`
2. Run the code:
	* For the distributed version, stand up the server with `npm run start:distributed-server 2`. The number of clients required is the first argument - defaulting to 2.
	* Stand up clients with `npm run start:distributed-client 192.168.0.12:5000`. The only argument defines where the server is hosted.
	* For the parallel version, run `npm run start:threaded 2`. The only argument is the number of threads to spawn.

## Tech
Both versions run the same way. Clients are invoked with arguments:
* nodes in the pool
* node number
* ciphertext
Nodes then get their words from a local dictionary and split this by their calculated block size, and their position (Block size = wordlist length / number of nodes).
Nodes iterate through this, calculating (ciphertext ^ word). If the result is readable (defined by some regex: `/^[a-zA-Z0-9\., \'\"\-_\:\(\)]+$/`) then the key and decoded, readable, ciphertext is sent back to the host. If these two the CT and Key defined by the host, the program exits.

### Distributed
A websocket server waits for the desired amount of clients. Upon reaching this number, a 'begin' event is sent to each client, as well as their number, size and ciphertext (defined by the interface in lib/shared.ts). Nodes do their brute-force loop and send back any candidates.

### Threaded
Using `worker_threads`, threads are spawned according to the argument given to `threaded.js`. Worker threads are spawned with the `new Worker(workerfile, workerData)` constructor. Amount of threads, thread position and ciphertext is sent in workerData.

## Results

### Distributed
| Run | 1 Client (ms) | 2 Clients (ms) | 4 Clients (ms) |
|-----|---------------|----------------|----------------|
|  1  |      6533     |      3604      |      1787      |
|  2  |      6730     |      3623      |      1846      |
|  3  |      6529     |      3801      |      1754      |
### Threaded
| Run | 1 Thread (ms) | 2 Threads (ms) | 4 Threads (ms) | 8 Threads (ms) |
|-----|---------------|----------------|----------------|----------------|
|  1  |      5752     |      2898      |      1360      |      1167      |
|  2  |      5985     |      3073      |      1327      |      1124      |
|  3  |      5795     |      2871      |      1441      |      1136      |