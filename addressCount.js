const logs = require('../allLogs/0x8c9b261faef3b3c2e64ab5e58e04615f8c788099_logs.json');
const fs = require('fs');

let totalCount = 0;
let addresses = []

let Sellerlogger = fs.createWriteStream('./addressTransferCount/SELLER' + logs[0].address.toString() + '_addressCount.txt', { flags: 'a' });
console.log(logs);
Sellerlogger.write("Sellers");

logs.forEach(element => {
    let checkAddress = "0x" + element.topics[1].toString().substring(26);
    if (!addresses.some(address => address === checkAddress)) {
        addresses.push(checkAddress);
        Sellerlogger.write("\n");
        Sellerlogger.write(checkAddress);
        totalCount++;
    }
});

Sellerlogger.write("\n");
Sellerlogger.write("Total Sellers: " + totalCount)


//Buyer Code
let buyerAddresses = [];
let addressCounter = 0;
let buyerlogger = fs.createWriteStream('./addressTransferCount/BUYER' + logs[0].address.toString() + '_addressCount.txt', { flags: 'a' });

buyerlogger.write("Buyer");

logs.forEach(element => {
    let buyerAddress = "0x" + element.topics[2].toString().substring(26);
    if (!buyerAddresses.some(address => address === buyerAddress)) {
        buyerAddresses.push(buyerAddress);
        buyerlogger.write("\n");
        buyerlogger.write(buyerAddress);
        addressCounter++;
    }
});

buyerlogger.write("\n");
buyerlogger.write("Total Buyers: " + addressCounter)
console.log("Done");
