// http://localhost:8161/admin
// https://sleuthkit.org/autopsy/docs/user-docs/4.0/install_activemq.html

const stompit = require('stompit');
const client = stompit.Client;
const connectOptions = {
  'host': 'localhost',
  'port': 61613,
  'connectHeaders':{
    'host': '/',
    'login': 'hbaocr',
    'passcode': '12345678',
    'heart-beat': '5000,5000'
  }
};



stompit.connect(connectOptions, function(error, client) {
  
  if (error) {
    console.log('connect error ' + error.message);
    return;
  }
   
  const subscribeHeaders = {
    'destination': '/queue/test1',
    'ack': 'client-individual'
  };
  
  client.subscribe(subscribeHeaders, function(error, message) {
    
    if (error) {
      console.log('subscribe error ' + error.message);
      return;
    }
    //console.log(message);
    message.readString('utf-8', function(error, body) {
      
      if (error) {
        console.log('read message error ' + error.message);
        return;
      }
      
      console.log('received message: ' + body);
      
      client.ack(message);
      
      client.disconnect();

    });
  });
});
