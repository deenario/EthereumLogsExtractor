const abi = require('./abi.json');
const logs = require('./logs.json');
const keccak256 = require('keccak256')
const Web3 = require('web3');


let resultFunctions = [];

abi.forEach((element, index) => {
    let tempString = '';
    if (element['type'] === 'event') {
        tempString += element.name + "(";
        element['inputs'].forEach((input) => {
            tempString += input.type + ","
        });
        tempString = tempString.substring(0, tempString.length - 1);
        tempString += ")";
        resultFunctions.push({
            name: element.name,
            index: index,
            event: tempString,
            keccakSignature: keccak256(tempString).toString('hex')
        });
    }
});

// console.log(resultFunctions);
let infura_url = "https://mainnet.infura.io/v3/853346f695b740fe8bd7d8f583bcf55f"
let web3 = new Web3(new Web3.providers.HttpProvider(infura_url))
// web3.eth.getPastLogs({
//     address: "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe",
//     topics: ["0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"]
// }).then(result => {
//     console.log(result)
// }).catch(err => {
//         console.log(err);
//});

// console.log(web3.eth.abi.decodeParameters(['address', 'address','uint256'], '0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'));
console.log(web3.eth.abi.decodeLog([{
        "indexed": false,
        "name": "from",
        "type": "address"
    },
        {
            "indexed": false,
            "name": "to",
            "type": "address"
        },
        {
            "indexed": false,
            "name": "tokenId",
            "type": "uint256"
        }],
    '0x000000000000000000000000683f6e80c378e57fea188d53f4440600e87abc46000000000000000000000000367948fce42d3e8f4719ff23caf7b9c8b2eeaf840000000000000000000000000000000000000000000000000000000007170946',
     [ '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef']));
