//THIS nodejs requires a json file named "file.json", in the same directory. 

const fs = require('fs');
const crypto = require('crypto');


//reads for local file "file.json"
var file = fs.readFileSync("file.json", "utf8");

var algorithm = 'aes-256-ctr';
var key = 'd6F3Efeq';

//encrypt text
function encrypt(text){
  var cipher = crypto.createCipher(algorithm,key)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
//decrypt text
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,key)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
 
//encrypt
var encryptedJSON = encrypt(file)

//everything is in this block cause idk how asynchronous callback functions work
//write to file
fs.writeFile('encryptedJSON.txt', encryptedJSON, { flag: 'w' }, (err) => {  
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
	fs.writeFile('decryptedJSON.txt', decryptedJSON, { flag: 'w' }, (err) => {  
	    // throws an error, you could also catch it here
	    if (err) throw err;

	    // success case, the file was saved
	    console.log('decrypted file written');
	});

});



