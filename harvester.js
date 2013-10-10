var Tail = require('tail').Tail;
var fs   = require('fs');

exports.Harvester = function( socket ){
    var jsonFile = "";
    var filesToTail = [];
    try{
        jsonFile = fs.readFileSync('config.json');
        filesToTail = JSON.parse(jsonFile);
    }catch (error){
        console.error(error);
        process.exit(-1);
    }
    
    console.dir( filesToTail );
    socket.emit('channels', {'channels': filesToTail });

    var fileTails = [];
    var i = 0;
    filesToTail.forEach( function(file){
        console.log("file path ==>" + file.path);
        var ft = new Tail(file.path);
        ft.on("line", function(data){
            console.log("data" + data);
            socket.emit('logcast',{'title': file.title, 'message': data });
        });
        fileTails[i] = ft;
        i++;
    });
     
} 

//exports.Harvester(null);