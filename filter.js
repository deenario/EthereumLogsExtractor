const Web3 = require('web3');
const fs = require('fs');
const XLSX = require('xlsx');

(async () => {

    ///// CODE FOR EXCEL SHEET. //////////////
    const workbook = XLSX.readFile('./addresses.xlsx');
    const sheet_name_list = workbook.SheetNames;
    let addresses = (XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
    addresses.forEach(async address => {

        let infura_url = "https://mainnet.infura.io/v3/2d24b86e8d884f5aa7a11e78dbb3c87d"
        let etherNode = "http://localhost:8545";
        let web3 = new Web3(new Web3.providers.HttpProvider(etherNode))
        let startBlock = 9095463;
        let endingBlock = 9095563;

        console.log("\n\n\n\n");
        console.log("For Addres:", address.ContractAddress);
        let contractAddress = address.ContractAddress;
        let i = startBlock + 1;

        while (i <= endingBlock) {
            let fromBlock = i - 1;
            let toBlock = i;
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
            i = i + 2;
        }
        // REMEMBER TO UNCOMMENT THESE BRACKETS.
    });
})().catch(e => {
    console.log(e)
});
