//https://wiki.openraildata.com/index.php/Node_JS_Examples
const stompit = require('stompit');

class StmompitSubOnce {

    constructor(connect_options) {
        const connectOptions = {
            'host': 'localhost',
            'port': 61613,
            'connectHeaders': {
                'host': '/',
                'login': 'hbaocr',
                'passcode': '12345678',
                /*enable heart-beating. Format of header value: x,y where x and y are the number of milliseconds 
                between heart-beats sent and received respectively */
                'heart-beat': '5000,5000'// hear-beat of 5 seconds
            }
        };

        // Reconnect management for stompit client
        const reconnectOptions = {
            "initialReconnectDelay": 10,    // milliseconds delay of the first reconnect
            "maxReconnectDelay": 30000,     // maximum milliseconds delay of any reconnect
            "useExponentialBackOff": true,  // exponential increase in reconnect delay
            "maxReconnects": 30,            // maximum number of failed reconnects consecutively
            "randomize": false              // randomly choose a server to use when reconnecting
            // (there are no other servers at this time)    
        };

        this.connectOptions = connect_options || connectOptions
        this.reconnectOptions = reconnectOptions;

    }
    async subscribe_once(chanel_name = '/queue/test1') {
        const connectOptions = this.connectOptions;
        const reconnectOptions = this.reconnectOptions;
        let subscribeHeaders = {
            /*subscribe for a destination to which messages are sent */
            'destination': `${chanel_name}`,
            /*the client will send ACK frames individually for each message processed */
            'ack': 'client-individual'
        };

        return new Promise((resolve, reject) => {
    
            const connectionManager = new stompit.ConnectFailover([connectOptions], reconnectOptions);
            connectionManager.connect(function (error, client, reconnect) {
                if (error) {
                    //console.log("Terminal error, gave up reconnecting");
                    reject(error);
                    return;
                };
                client.on("error", function (error) {
                    //console.log("Connection lost. Reconnecting...");
                    reconnect();
                });

                client.subscribe(subscribeHeaders, function (error, message) {
                    if (error) {
                        //console.log("Subscription failed:", error.message);
                        reject(error.message);
                        return;
                    }
                    message.readString('utf-8', function (error, body) {

                        if (error) {
                            //console.log('read message error ' + error.message);
                            reject(error.message);
                            return;
                        }

                        //console.log('received message: ' + body);

                        client.ack(message);
                        client.disconnect();
                        resolve(body);

                    });

                });
            });

        })
    }

}

module.exports =StmompitSubOnce;
