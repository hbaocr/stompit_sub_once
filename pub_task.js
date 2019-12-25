//http://localhost:8161/admin

const stompit = require('stompit');

const connectOptions = {
    'host': 'localhost',
    'port': 61613,
    'connectHeaders': {
        'host': '/',
        'login': 'hbaocr',
        'passcode': '12345678',
        'heart-beat': '5000,5000'
    }
};

stompit.connect(connectOptions, function (error, client) {

    if (error) {
        console.log('connect error ' + error.message);
        return;
    }

    const sendHeaders = {
        'destination': '/queue/test1',
        'content-type': 'text/plain'
    };

    for (let i=0;i<2;i++){
        const frame = client.send(sendHeaders);
        frame.write('this is the new msg '+i);
        frame.end();
    }
   
    client.disconnect();

});
