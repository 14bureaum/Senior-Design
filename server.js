//Requirements
var express = require('express');
var app = express();
var fs = require('fs')

var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "mysql",

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

//endpoint to generate a genesis block
app.get('/records', function(req, res){
    //string to hold SQL query
    //Query sql DB for all records
    //query db for table data
    con.query('SELECT status FROM SD.employees' , function(err, rows, fields){
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
                if(rows[i][0] == 0){
                    notReady++
                }else if(rows[i][0] == 1){
                    ready++
                }
                else if(rows[i][0] == 2){
                    published++
                }
            }
            var outHTML = '<table border=3><tr>';
            outHTML += '<th>Not Ready</th><th>Ready for Publishing</th><th>Published</th></tr>'
            outHTML += '<tr><td>' + notReady + '</td><td>' + ready + '</td><td>' + published + '</td></tr>'
            outHTML += '</table>'
            res.send(outHTML);
        }
    })
})

app.get('/publish', function(req, res){

    //query db for table data
    con.query('SELECT * FROM SD.employees', function(err, rows, fields){
        if(err){
            console.log(err);
            res.send('Error querying table');
        } else{
            //iterate through result and setup table html
            for(i=0; i<fields.length; i++){
                headers.push(fields[i].name);
            }
            for(i=0; i<rows.length; i++){
                if(rows[i][status] == 1){
                    var jsonString = '{\n'
                    for(j=0; j<fields.length; j++){
                        jsonString  += fields[j].name + ':' + rows[i][fields[j].name] + '\n';
                    }
                    var filepath = "./" + rows[i][name] + rows[i][id] + ".json"
                    fs.writeFile(filepath, JSON.stringify(jsonString), (err) => {
                        if (err) {
                            console.error(err);
                            return;
                        };
                        console.log("File has been created");
                    });
                    var key = encrypt(filepath)
                    var hash = pushToIPFS(filepath)
                    
                }
                
                outHTML += '</tr>';
            }
            outHTML += '</table>'
            res.send(outHTML);
        }
    })
    res.send(tableData);
})

function encrypt(filepath){

    return(key)
}

function pushToIPFS(filepath){

    return(hash)
}