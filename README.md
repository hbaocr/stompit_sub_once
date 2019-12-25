# stompit_sub_once

```javascript
//http://localhost:8161/admin

const StompitSubOnce = require('./StompitSubOnce');

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


const chanel = '/queue/test1';

async function main() {
  const client = new StompitSubOnce(connectOptions);
  //for (let i = 0; i < 1000; i++)
   {
    try {
      let msg=await client.subscribe_once(chanel);
      console.log(msg);
    } catch (error) {
      console.log(error);
    }
  }
}

main();

```
