//Client js functions

function records(){
    var URL = "http://localhost:8080/records";

    $.ajax({
        type: "GET",
        url: URL,
        contentType: "application/json; charset=utf-8",
        data: {},
        dataType: "html",
        success: function(msg){
            document.getElementById("stats").innerHTML = msg
        },
        error: function(xhr, ajaxOptions, thrownError){
            document.getElementById("content").innerHTML = "Error obtaining transcript data";
        }
    });
}

function publish(){
    var URL = "http://localhost:8080/publish";

    $.ajax({
        type: "GET",
        url: URL,
        contentType: "application/json; charset=utf-8",
        data: {},
        dataType: "html",
        success: function(msg){
            document.getElementById("stats").innerHTML = msg
        },
        error: function(xhr, ajaxOptions, thrownError){
            document.getElementById("content").innerHTML = "Error obtaining transcript data";
        }
    });
}