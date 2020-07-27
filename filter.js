const Web3 = require('web3');
const fs = require('fs');
const XLSX = require('xlsx');

(async () => {

    /////// CODE FOR EXCEL SHEET. //////////////
    // const workbook = XLSX.readFile('./addresses.xlsx');
    // const sheet_name_list = workbook.SheetNames;
    // let addresses = (XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
    // addresses.forEach(async address => {

    let infura_url = "https://mainnet.infura.io/v3/2d24b86e8d884f5aa7a11e78dbb3c87d"
    let etherNode = "http://localhost:8545";
    let web3 = new Web3(new Web3.providers.HttpProvider(etherNode))
    let startBlock = 6228526;
    let endingBlock = 9095563;

    ////////////////////////////////
    // let contractAddress =  address.ContractAddress;

    let contractAddress = "0x5d00d312e171be5342067c09bae883f9bcb2003b";
    let i = startBlock + 100;

    while (i <= endingBlock) {
        let fromBlock = i - 100;
        let toBlock = i - 1;
        const params = {
            address: contractAddress,
            topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"],
            fromBlock: fromBlock,
            toBlock: toBlock
        };
        let response = await web3.eth.getPastLogs(params);
        console.log("Response All fromBlock " + fromBlock + " to " + toBlock + " are " + response.length)
        let removeValFromIndex = []
        if (response.length > 0) {
            for (index = 0; index < response.length; index++) {
                if (response[index].topics.length < 4) {
                    removeValFromIndex.push(index);
                }
            }
            for (index = removeValFromIndex.length - 1; index >= 0; index--) {
                response.splice(Number(removeValFromIndex[index]), 1);
            }
            console.log("Response After Filter fromBlock " + fromBlock + " to " + toBlock + " are " + response.length)
            if (response.length > 0) {
                fs.appendFileSync('./json/' + params.address + '_logs.json', JSON.stringify(response));
            }

        }
        i += 100;
    }
    // REMEMBER TO UNCOMMENT THESE BRACKETS.
    //});
})().catch(e => {
    console.log(e)
});
