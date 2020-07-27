const logs = require('./json/0x0e3a2a1f2146d86a604adc220b4967a898d7fe07_logs.json');
const fs = require('fs');

let totalCount = 0;
let addresses = []

let logger = fs.createWriteStream('./addressTransferCount/' + logs[0].address.toString() + '_addressCount.csv', { flags: 'a' });
logger.write("From,Transfers");

logs.forEach(element => {
    let checkAddress = "0x" + element.topics[1].toString().substring(26);
    if (!addresses.some(address => address === checkAddress)) {
        addresses.push(checkAddress);
        logs.forEach(element2 => {
            let fromAddress = "0x" + element2.topics[1].toString().substring(26);
            if (checkAddress === fromAddress) {
                totalCount += 1;
            }
        });
        logger.write("\n");
        logger.write(checkAddress + "," + totalCount);
        totalCount = 0;
    }
});

console.log("Done");
