var app = require("express")(),
    http = require("http").Server(app),
    io = require("socket.io")(http);

http.listen(3000,function(){
  console.log("listening on port 3000");
});

    //app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
    console.log("opened index");
    res.sendFile(__dirname+"/index.html")
});

app.get('/dashboard.html',function(req,res){
    console.log("opened dashboard");
    res.sendFile(__dirname+"/dashboard.html");
});



    io.set('authorization', function (handshakeData, callback) {
        if (handshakeData.xdomain) {
            callback('Cross-domain connections are not allowed');
        } else {
            callback(null, true);
        }
    });

var counter=0;


io.on('connection', function (socket) {
    console.log("connected");
    counter++;
    socket.on('message', function (data) {
        console.log("Got message: " + data.url);
        ip = socket.handshake.address;
        console.log(ip);
        url = data.url;
        io.emit('pageview', { 'ip': '***.***.***.' + ip.substr(ip.lastIndexOf('.') + 1), 'url': url, 'xdomain': socket.handshake.xdomain, 'timestamp': new Date() , "users":counter});
    });

    socket.on('disconnect', function () {
        counter--;
        console.log("Socket disconnected");
    io.emit('pageview', { 'ip': '***.***.***.' + ip.substr(ip.lastIndexOf('.') + 1), 'url': url, 'xdomain': socket.handshake.xdomain, 'timestamp': new Date() , "users":counter});
    });

});


