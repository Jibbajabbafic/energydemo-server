// ------------------------------ Socket.io Code ------------------------------

// Define socket which automatically uses the connected server
var socket = io();

// Code to update toggle read button colour based on if reading sensor
socket.on('toggleStatus', function(data){
    if (data) {
        $('#toggleRead').css('background-color', '#90e79e');
    } else {
        $('#toggleRead').css('background-color', '#e79090');
    }
});

// Code to update relay button colours
socket.on('relayStatus', function(data){
//  data = {
//      bulb: "bike",
//      kettle: "handcrank",
//      charger: null
//  }
    console.log("Receiving relayStatus:");
    console.log(data);
    for (output in data) {
        $('button.relay.'+ output).each(function( index ) {
            if ($(this).hasClass(data[output]))
                $(this).css('background-color', '#90e79e');
            else
                $(this).css('background-color', '#e79090');
        });   
    }
    // $('button.relay.bulb')
    // for (output in data) {
    //     switch (data[obj]) {
    //         case "bike":
    //             $('button.relay.bike.' + data.output).css('background-color',  '#90e79e')
    //             break;

    //         case "handcrank":
                
    //             break;

    //         default:
    //             break;
    //     }
    // }
});

// ------------------------------ jQuery Functions ------------------------------

$(document).ready( function() {
    
    // ----- Button Code -----
    
    $('button#toggleRead').on('click', function(){
        console.log('TOGGLING');
        socket.emit('toggle', '');
    });

    $('button.relay').on('click', function(){
        console.log('SWITCHING RELAYS');
        let relayClasses = this.classList;

        let relayData = {
            input: relayClasses[1],
            output: relayClasses[2]
        };

        console.log(relayData)
        socket.emit('relaySwitch', relayData);
    });    

});