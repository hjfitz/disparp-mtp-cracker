# [DISPARP] Distributed Systems and Parallel Programming - Coursework Project
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
	* For the distributed version, stand up the server with `npm run start:cluster-naster 2`. The number of clients required is the first argument - defaulting to 2.
	* Stand up clients with `npm run start:cluster-client-client 192.168.0.12:5000`. The only argument defines where the server is hosted.
	* For the parallel version, run `npm run start:threaded 2`. The only argument is the number of threads to spawn.
	* To run the worker farm code, prepend the aforementioned commands with `farm-`, `npm run start:farm-cluster-worker` etc.

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
Available on [Google Sheets](https://docs.google.com/spreadsheets/d/1rfd0MSvlGD4TiAJzQ9l7tq3FgKl0P2Nm5BpdcP8GT0Q/edit#gid=1020168994)