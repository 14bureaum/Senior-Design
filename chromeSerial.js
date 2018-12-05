var serial = chrome.serial;

chrome.serial.getDevices(function(ports) {
    for (let port of ports) {
        if (port.vendorId) {
            console.log(port);
        }
    }
});
