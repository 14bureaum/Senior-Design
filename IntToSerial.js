var SerialPort = require('serialport')

function IntToSerial(int) {
    const port = new SerialPort('/pathtousb/usbname', {baudRate: 9600});
    port.write(int)
}

IntToSerial("1");
IntToSerial("2");
IntToSerial("3");