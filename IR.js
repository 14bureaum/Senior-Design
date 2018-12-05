var SerialPort = require('serialport')

                       //name of serial port, baud rate
const port = new SerialPort('COM5', {baudRate: 9600});

port.open();
port.write("0");

port.on('readable', function () {
  var IRData = port.read();
})

port.write("1");
port.write(IRData);

port.close();
