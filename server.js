//Requirements
var express = require('express');
var fs = require('fs');
var mysql = require('mysql');
const ipfsClient  = require('ipfs-http-client');
const crypto = require('crypto');

var app = express();
const ipfs = ipfsClient('ipfs.infura.io', '5001', {protocol: 'https'})


var algorithm = 'aes-256-ctr';
var key = 'd6F3Efeq';

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root"
    
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
    
    con.query('SELECT status FROM sd.employees' , function(err, rows, fields){
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
                if(rows[i]['status'] == 0){
                    
                    notReady++
                }else if(rows[i]['status'] == 1){
                    ready++
                }
                else if(rows[i]['status'] == 2){
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

app.get('/publish',  function(req, res){

    //query db for table data
    con.query('SELECT * FROM SD.employees WHERE status = 1',  function(err, rows, fields){
        if(err){
            console.log(err);
            res.send('Error querying table');
        } else{
            //iterate through result and setup table html
            var headers = [];
            var outHTML = "";
            for(i=0; i<fields.length; i++){
                headers.push(fields[i].name);
            }
            for(i=0; i<rows.length; i++){
                
                var jsonString = '{'
                for(j=0; j<fields.length; j++){
                    jsonString  += '"' + fields[j].name + '" : "' + rows[i][fields[j].name] + '",\n';
                }
                jsonString = jsonString.slice(0, -2);
                jsonString += '\n}'
                var filepath = "./" + rows[i]["name"] + rows[i]["id"] + ".json"
                fs.writeFile(filepath, jsonString, (err) => {
                    if (err) {
                        console.error(err);
                        return;
                    };
                    console.log("File has been created");
                    encrypt(filepath)
                    
                    let file = fs.readFileSync(filepath)
                    let filebuffer = new Buffer(file)
                    ipfs.add(filebuffer, function (err, file) {
                        if (err) {
                        console.log(err);
                        }

                        outHTML += "<tr><td>" + filepath + "</td><td>" + file[0].hash + "</td><td> d6F3Efeq </td><td>RESET</td></tr>"
                        res.send(outHTML);
                    })
                    
                    
                    
                });
                
            }


        }
    })
    
})

//encrypt text
function encrypt(filepath){
    var file = fs.readFileSync(filepath, "utf8");
    
    var algorithm = 'aes-256-ctr';
    var key = 'd6F3Efeq';

    var cipher = crypto.createCipher(algorithm,key)
    var crypted = cipher.update(file,'utf8','hex')
    crypted += cipher.final('hex');
    fs.writeFile('encryptedJSON.txt', crypted, { flag: 'w' }, (err) => {  
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

function pushToIPFS(filepath){
    let file = fs.readFileSync(filepath)
    let filebuffer = new Buffer(file)
    ipfs.add(filebuffer, function (err, file) {
        if (err) {
          console.log(err);
        }

        return(file[0].hash)
      })
    
}
function decrypt(text){
    var decipher = crypto.createDecipher(algorithm,key)
    var dec = decipher.update(text,'hex','utf8')
    dec += decipher.final('utf8');
    return dec;
  }