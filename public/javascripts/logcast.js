$(document).ready(function() {
      var ch = "all";
      var title = $("#title");
      var messages = $("#messages");
      var socket = io.connect('http://localhost');
      
      socket.on('logcast', function (data) {
         console.log(data);
         //socket.emit('logcast', {});
         if( data ){
             console.dir( data );
             if(ch == data.title){
               title.html( data.title);
               messages.prepend( "<tr><td>" + data.message + "</td></tr>").append('<br>');
             }
         }
      });

      socket.on('channels', function(data){
        console.dir( data );
        if(data){
          var buffOpt = "";
          data.channels.forEach(function(row){
            buffOpt += "<option value=" + row.title + ">" + row.title + " - " + row.path +"</option>";
          });
          $("#channels").append(buffOpt);
        }
      });
      
      $('#channels').bind('change',function(e){
        var val = $(this).val();
        var vO = { 'channel': val};
        ch = val;
        socket.emit('logcast', vO );
        $('#selected-log').html( val );
        $('#title').html(val);
      });
});

