//Client js functions

//function to make AJAX call to get transcript contents
function dispTranscript(){
    var URL = "http://localhost:8080/transcript";
    var studentObj = document.getElementById("studentOption");
    var studentOption = studentObj.options[studentObj.selectedIndex].text;
    var termObj = document.getElementById("termOption");
    var termOption = termObj.options[termObj.selectedIndex].text;

    $.ajax({
        type: "GET",
        url: URL,
        contentType: "application/json; charset=utf-8",
        data: {'s':studentOption, 't':termOption},
        dataType: "html",
        success: function(msg){
            document.getElementById("transcriptOut").innerHTML = msg;
        },
        error: function(xhr, ajaxOptions, thrownError){
            document.getElementById("content").innerHTML = "Error obtaining transcript data";
        }
    });
}

function LEDColor(R, G, B){
    var URL = "http://localhost:8080/RGB";
    $.ajax({
        type: "GET",
        url: URL,
        contentType: "application/json; charset=utf-8",
        data: {'r':R, 'g':G, 'b': B},
        dataType: "html",
        success: function(msg){
        },
        error: function(xhr, ajaxOptions, thrownError){
            document.getElementById("content").innerHTML = "Error obtaining transcript data";
        }
    });
}