var http = require('http');
const crypto = require('crypto');
var request = require('request');



console.log("Retrieve clicked");
    //transactionID
    //var txID = req.tx;
    var txID = 'c728c783a4ecca74cde9510a9dafe33f3859aa500ad8e4336e32b5f3cbb24589';

    //host + path to get bigchain transaction
    var host = 'http://10.53.0.5:10004'
    var path = '/api/v1/transactions?asset_id=' + txID

    //console.log(host + path)
    http.get(host+path, function (res) {
        var ipfsHash = '';
        var bigchainData = '';

        res.on('data', function (chunk) {
            bigchainData += chunk;
            var bigchainJSON = JSON.parse(bigchainData);

            //console.log(bigchainJSON[0].asset.data.DID)

            //TESTING hardcoded ipfsHash
            //ipfsHash = bigchainJSON[0].asset.data.DID
            ipfsHash = 'QmeT4B6RUmTd2WK4HvU6mBxeCPUo7DUNievBWf1LPw2rxu';


            //options to get IPFS file
            var host = 'http://10.53.0.5:8080'
            var path = '/ipfs/' + ipfsHash

            //console.log(host+path)
            
            request.get(host + path, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var ipfsData = body;
                    console.log(ipfsData)
                    
                    //ecrypt ipfsData
                    var algorithm = 'aes-256-ctr';
                    var key = 'd6F3Efeq';

                    var decipher = crypto.createDecipher(algorithm,key)

                    //console.log(ipfsData)    
                    var dec = decipher.update(ipfsData,'hex','utf8')
                    dec += decipher.final('utf8');
                    console.log('Decrypted JSON: ' +  dec);    




                    }
                });

/*            http.get(host+path, function (res) {
                //console.log(res)

                res.on('data', function (chunk) {

                    var ipfsData = ''
                    ipfsData += chunk;
                    //TESTING log ipfsData
                    console.log(ipfsData);


                    //ecrypt ipfsData
                    var algorithm = 'aes-256-ctr';
                    var key = 'd6F3Efeq';

                    var decipher = crypto.createDecipher(algorithm,key)

                    //console.log(ipfsData)    
                    var dec = decipher.update(ipfsData,'hex','utf8')
                    dec += decipher.final('utf8');
                    console.log('Decrypted JSON: ' +  dec);    


                });
            });   */
            res.on('error', function (e) {
                console.log(e.message);
            });
        });

    });

    
