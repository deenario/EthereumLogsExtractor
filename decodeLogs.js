const fs = require('fs');
const Web3 = require('web3');
const logs = require('./json/0x0e3a2a1f2146d86a604adc220b4967a898d7fe07_logs.json');
let infura_url = "https://mainnet.infura.io/v3/2d24b86e8d884f5aa7a11e78dbb3c87d";
let web3 = new Web3(new Web3.providers.HttpProvider(infura_url));

(async () => {
    let logger = fs.createWriteStream('./csv/' + logs[0].address + '_logs.csv', {flags: 'a'});
    logger.write("Seller,Buyer")
    for (const data of logs) {
        let result = await web3.eth.abi.decodeLog([{
                "indexed": false,
                "name": "from",
                "type": "address"
            }, {
                "indexed": false,
                "name": "to",
                "type": "address"
            }, {
                "indexed": false,
                "name": "tokenId",
                "type": "uint256"
            }],
            data.topics[1] + data.topics[2].substring(2) + data.topics[3].substring(2),
            [data.topics[0]]);
        logger.write("\n");
        logger.write(result.from + "," + result.to);
    }
})().catch(e => {
    console.log(e)
});
