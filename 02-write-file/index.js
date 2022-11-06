const { stdin , stdout } = process;
const path = require('path');
const fs = require('fs');
const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write(`Hello, please enter your text. Type 'exit' to stop. \n`);

stdin.on('data', data => {
    const input = data.toString().trim();
    if (input === 'exit') {
        exitProcess();
    }

    output.write(data);
})

process.on('SIGINT', exitProcess)

function exitProcess() {
    stdout.write('Exit programm. Goodbye!');
    process.exit();
}