//Requirements
var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
const ipfsClient  = require('ipfs-http-client');
const crypto = require('crypto');
var driver = require('bigchaindb-driver');
var async = require("async");

var app = express();
const ipfs = ipfsClient('10.53.0.5', '5001', { protocol: 'http' });

const API_PATH = 'http://10.53.0.5:9994/api/v1/'
const verify = new driver.Ed25519Keypair()


var algorithm = 'aes-256-ctr';
var key = 'd6F3Efeq';

var con = mysql.createConnection({
    host: "10.1.0.5",
    user: "phpmyadmin",
    password: "p1-1pmy4dm1n"
    
});

//connection function
con.connect(function(err){
	if(err){
		console.log('Error connecting to database');
		console.log(err);
	}
	else{
		console.log('Successfully connected to database');
	}
});

//setup static webpage and listen on port 8080.  Serve index.html upon successful connection
app.use(express.static("."));
app.listen(8080, function(){
    app.use(express.static("index.html"));
    console.log('Running...')
})


app.get('/records', function(req, res){
    //string to hold SQL query
    //Query sql DB for all records
    //query db for table data
    
    con.query('SELECT * FROM PROD_verify.organization_students' , function(err, rows, fields){
        if(err){
            console.log(err);
            res.send('Error querying table');
        } else{
            //iterate through result and setup table html
            var notReady = 0
            var ready = 0
            var published = 0
            outHTML += '</tr>'
            for(i=0; i<rows.length; i++){
                if(rows[i]['is_publishedToOffchain'] == 0){
                    ready++
                }
                else if(rows[i]['is_publishedToOffchain'] == 1){
                    published++
                }
            }
            var outHTML = '<table class="table table-borderless table-striped table-earning"><tr>';
            outHTML += '<th>Not Ready</th><th>Ready for Publishing</th><th>Published</th></tr>'
            outHTML += '<tr><td>' + notReady + '</td><td>' + ready + '</td><td>' + published + '</td></tr>'
            outHTML += '</table>'
            res.send(outHTML);
        }
    })
})

app.get('/oldrecords', function(req, res){
    //string to hold SQL query
    //Query sql DB for all records
    //query db for table data
    
    con.query('SELECT * FROM PROD_verify.organization_students WHERE is_publishedToOffchain = 1' , function(err, rows, fields){
        if(err){
            console.log(err);
            res.send('Error querying table');
        } else{
            //iterate through result and setup table html
            var outHTML = ''
            for(i=0; i<rows.length; i++){
                outHTML += "<tr><td>" + rows[i]['json_filename'] + "</td><td><a href=https://10.53.0.5/ipfs/" + ">" + rows[i]['offchain_filehash'] + "</a></td><td> d6F3Efeq </td><td>RESET</td></tr>"
                            
            }
            res.send(outHTML);
        }
    })
})

app.get('/publish', function(req, res){
    console.log("publish clicked");
    //query db for table data
    con.query('SELECT id, organization_id, email, first_name, last_name, gender, phone, city, zipcode FROM PROD_verify.organization_students WHERE is_publishedToOffchain = 1 LIMIT 1',  function(err, rows, fields){
        if(err){
            console.log(err);
            res.send('Error querying table');
        } else{
            //iterate through result and setup table html
            var headers = [];
            var outHTML = "";
            var count = 0;
            for(i=0; i<fields.length; i++){
                headers.push(fields[i].name);
            }

            var outSQL = "INSERT INTO PROD_verify.organization_students (id, organization_id, email, is_publishedToOffchain, offchain_published_time, offchain_published_by, json_filename, en_de_code_key, offchain_filehash, blockchain_ledgerTxn_id) VALUES "
            async.forEachOf(rows, function(row, i, callback){
                
                var jsonString = '{'
                for(j=0; j<fields.length; j++){
                    jsonString  += '"' + fields[j].name + '" : "' + row[fields[j].name] + '",\n';
                }
                jsonString = jsonString.slice(0, -2);
                jsonString += '\n}'
                
                //TODO:: fix file paths
                var filepath = "./organization_students/" + row["first_name"] + row["id"] + ".json"
                fs.writeFile(filepath, jsonString, (err) => {
                    console.log("File has been created");
                    var file = fs.readFileSync(filepath, "utf8");
    
                    var algorithm = 'aes-256-ctr';
                    var key = 'd6F3Efeq';
                    //TODO: Turn on encryption, rewrite as async functgion with callback
                    var cipher = crypto.createCipher(algorithm,key)
                    var crypted = cipher.update(file,'utf8','hex')
                    crypted += cipher.final('hex');
                    fs.writeFile('encryptedJSON'+ i + '.txt', file, { flag: 'w' }, (err) => {  
                        // throws an error, you could also catch it here
                    
                        // success case, the file was saved
                        console.log('encrypted file written');
                    
                        //read file 
                        var encryptedJSON1 = fs.readFileSync('encryptedJSON' + i + '.txt',"utf8");
                        console.log("json: ");
                        console.log(encryptedJSON1.toString());
                        
                        // success case, the file was saved
                        // count++;
                        // outHTML += "<tr><td>" + filepath + "</td><td> hfdgsjaklfnkjnijcvhnjcn </td><td> d6F3Efeq </td><td>RESET</td></tr>"
                            
                        //     if(count == rows.length){
                        //         console.log(outHTML);
                        //         res.send(outHTML);
                        //     }
                        let file = fs.readFileSync('encryptedJSON'+ i + '.txt')
                        let filebuffer = new Buffer(file)
                        ipfs.add(filebuffer, function (err, file) {
                            if(err){
                                console.log(err);
                            }
                            outHTML += "<tr><td>" + filepath + "</td><td><a href=10.53.0.5:8080/ipfs/" + file[0].hash + ">" + file[0].hash + "</a></td><td> d6F3Efeq </td><td>RESET</td></tr>"
                            
                            
                            //TODO: write to blockchain as next step.  Collect txn ID and add as info to HTML
                            let tx = driver.Transaction.makeCreateTransaction(
                                
                                { DID: file[0].hash},

                                
                                null,

                                // A transaction needs an output
                                [ driver.Transaction.makeOutput(
                                        driver.Transaction.makeEd25519Condition(verify.publicKey))
                                ],
                                verify.publicKey
                            )

                            const txSigned = driver.Transaction.signTransaction(tx, verify.privateKey)
                            const conn = new driver.Connection(API_PATH)
                            conn.postTransactionCommit(txSigned).then(function(retrievedTx){
                                count++;
                                outSQL += "(" + row["id"] + ", " + row["organization_id"] + ", 'test', 1, NOW(), 'system', '" + filepath + "', 'd6F3Efeq', '" + file[0].hash + "', '" + retrievedTx.id + "'),"
                                console.log('Transaction', retrievedTx.id, 'successfully posted.')
                                if(count == rows.length){
                                    //TODO: Kickoff bulk update function
                                    outSQL = outSQL.slice(0, -1);
                                    
                                    outSQL += " ON DUPLICATE KEY UPDATE is_publishedToOffchain = VALUES(is_publishedToOffchain), offchain_published_time = VALUES(offchain_published_time), offchain_published_by = VALUES(offchain_published_by), json_filename = VALUES(json_filename), en_de_code_key = VALUES(en_de_code_key), offchain_filehash = VALUES(offchain_filehash), blockchain_ledgerTxn_id = VALUES(blockchain_ledgerTxn_id);"
                                    con.query(outSQL,  function(err){
                                        if(err){
                                            console.log(err);
                                            res.send('Error querying table');
                                        } else{
                                            console.log("Table Updated!");
                                            res.send(outHTML);
                                        }});
                                }
                                callback();
                            });
                            
                            
                        })
                        
                    
                    });     
                     
                });   
            })}
    })
})

// app.get('/reset', function(req, res){
//     //string to hold SQL query
//     //Query sql DB for all records
//     //query db for table data
    
//     con.query('UPDATE hash FROM PROD_verify.kyc_submissions WHERE ID == ' + res.id , function(err, rows, fields){
//         if(err){
//             console.log(err);
//             res.send('Error querying table');
//         } 
//     })
// })


//encrypt text
function encrypt(filepath){
    var file = fs.readFileSync(filepath, "utf8");
    
    var algorithm = 'aes-256-ctr';
    var key = 'd6F3Efeq';

    var cipher = crypto.createCipher(algorithm,key)
    var crypted = cipher.update(file,'utf8','hex')
    crypted += cipher.final('hex');
    fs.writeFile('encryptedJSON.txt', crypted, { flag: 'w' }, async (err) => {  
        // throws an error, you could also catch it here
        if (err) throw err;
    
        // success case, the file was saved
        console.log('encrypted file written');
    
        //read file 
        var encryptedJSON1 = fs.readFileSync('encryptedJSON.txt',"utf8");
        console.log("encrypted json: ");
        console.log(encryptedJSON1.toString());
        var decryptedJSON = decrypt(encryptedJSON1);
        // writes decrypted file
        fs.writeFile('decryptedJSON.JSON', decryptedJSON, { flag: 'w' }, (err) => {  
            // throws an error, you could also catch it here
            if (err) throw err;
    
            // success case, the file was saved
            console.log('decrypted file written');
        });
    
    });
}

function decrypt(text){
    var decipher = crypto.createDecipher(algorithm,key)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
}