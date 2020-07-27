const Web3 = require('web3');
const fs = require('fs');
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require('http');

const app = express();

// Body Parser Middleware
app.use(bodyParser.json({limit:'100mb'}));
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
app.use(cors());

const port = 8000;

app.set('port', port);
const httpsServer = http.createServer(app);

httpsServer.listen(port, () => {
    console.log('HTTPS Server running on port ', port);
});

let infura_url = "https://mainnet.infura.io/v3/853346f695b740fe8bd7d8f583bcf55f"
let web3 = new Web3(new Web3.providers.HttpProvider(infura_url))


app.get('/api/getTokenLogs', async function (req, res) {

    const params = {
        address: req.query.address,
        topics: ["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"],
        fromBlock: req.query.fromBlock,
        toBlock: req.query.toBlock
    };

    let logger = fs.createWriteStream('./csv/' + params.address + '_logs.csv', {flags: 'a'});
    logger.write("From,To,TokenID")
    web3.eth.getPastLogs(params).then(response => {
        response.forEach(data => {
            let result = web3.eth.abi.decodeLog([{
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
            logger.write(result.from + "," + result.to + "," + result.tokenId);
        });
        logger.write("\n");
        logger.write("Total Number of Transfers: " + response.length.toString());
        fs.writeFileSync('./json/' + params.address + '_logs.json', JSON.stringify(response));
        res.send({message:"Results written to ./csv/" + params.address + '_logs.csv'});
    });

});
