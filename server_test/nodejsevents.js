import { EventEmitter } from 'node:events';

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('waterFull', () => {
  console.log('Paani ki tanki bhar gai hai!');
  setTimeout(() => {
    console.log("Motor bandh kre!!!!");
  }, 3000);
});
console.log("Script is running!")
myEmitter.emit('waterFull');
console.log("Script is still running!")