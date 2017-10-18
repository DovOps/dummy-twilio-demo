var texts = 0;
var calls = 0;
$(function () {
    $("#number").text("+44 2221 111111")
    var socket = io();
    socket.on('sms', function (msg) {
        if ("System" != msg.From) $("#texts").text(++texts);
        $('#to').val(msg.From);
        var el=$('<li>').attr("title", JSON.stringify(msg)).text(msg.From + ":  " + msg.Body);
        $('#messages').prepend(el);
        el.fadeTo(100, 0.3, function() { $(this).fadeTo(500, 1.0); });
    });

    socket.on('voice', function (msg) {
        $('#to').val(msg.From);
        $("#voices").text(++calls);
        var el=$('<li>').data("id",msg.CallSid).attr("title", JSON.stringify(msg)).text("New Call: " + msg.From + ":  (" + msg.FromCity + "," + msg.FromCountry + "): " + msg.CallStatus);
        $('#calls').prepend(el);
        el.click(function(){
            var callId = $(this).data("id");
            $.post("/terminate",{id:callId});
        });
        el.fadeTo(100, 0.3, function() { $(this).fadeTo(500, 1.0); });
        
    });

    socket.on('status', function (msg) {
        var el=$('<li>').attr("title", JSON.stringify(msg)).text("UPDATE: " + msg.From + ":  (" + msg.FromCity + "," + msg.FromCountry + "): " + msg.CallStatus);
        $('#calls').prepend(el);
        el.fadeTo(100, 0.3, function() { $(this).fadeTo(500, 1.0); });
        
    });

    $('form').submit(function () {
        socket.emit('send', { to: $('#to').val(), body: $('#text').val() });
        $('#text').val('');
        return false;
    });
});