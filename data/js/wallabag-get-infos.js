self.port.on('ping', function wallabagPing(){
    var url = document.URL;

    var pageInfos = {
        wallaUrl: url,
    };

    self.port.emit('pong', pageInfos);
});
