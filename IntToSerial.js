var SerialPort = require('serialport')

function IntToSerial(int) {
    const port = new SerialPort('COM5', {baudRate: 9600});
    port.write(int);
}

const port = new SerialPort('COM5', {baudRate: 9600});
port.open();
port.write("1");
port.close();


//IntToSerial("1");
//IntToSerial("2");
