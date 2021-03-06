function WebSocketProxy(config) {
    var self = this;
    var defaultConfig = {
        url: 'http://localhost:8890',
        channelId: 'default',
        options: {}
    };

    this.config = $.extend(defaultConfig, config || {});

    this.socket;
    function init() {
        self.socket = io.connect(self.config.url);

        self.socket.on(self.config.channelId, handleIncomingMessage);

        self.socket.emit('init-client', self.config.channelId)
    }

    function handleIncomingMessage(data) {
        var message = JSON.parse(data);
        console.log('incoming message:', message);
        var event = new jQuery.Event(message.eventType + '.websocketproxy', {
            body: message.eventData,
            replyTo: message.replyTo,
            callbackQueue: message.callbackQueue,
        });
        $(self).trigger(event)
    }

    init()
}
