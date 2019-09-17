const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const readline = require('readline');
const lineReader = require('line-reader');

let ioClient = [];

app.use(express.static('SatelliteAng/Satellite/dist/Satellite'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/SatelliteAng/Satellite/dist/Satellite/index.html');
});

let GSViewValuesEnum = Object.freeze({
  "messageType": 0,
  "numberOfMessages": 1,
  "messageNumber": 2,
  "totalNumberSatInView": 3
});

let oneSatelliteValuesEnum = Object.freeze({
  "idNumber": 4,
  "elevation": 5,
  "azimuth": 6,
  "snr": 7
});

let GSActiveValuesEnum = Object.freeze({
  "messageType": 0,
  "satAcuisitionMode": 1,
  "positioningMode": 2,
  "idsOfUsedSats": 3,
  "pdop": 15,
  "hdop": 16,
  "vdop": 17

});

let intervalIds = [];
let rl;
let messages = [];

/* async function pause(seconds) {
  setTimeout(() => {
    return;
  }, 4000);
  return undefined;
} */


io.on('connection', function (socket) {

  ioClient.push(socket.id);

  socket.on('start send messages', function () {


    lineReader.eachLine('./GPS_log.txt', async (line) => {
      let parsedMessage = line.split(',');
      parsedMessage.forEach(l => l.trim());

      let message;

      let checkSum = line.substring(1).split('*');

      if (parsedMessage[0] === '$GPGSV') {
        message = new GSView(parsedMessage[GSViewValuesEnum.messageType],
          checkSum[0],
          checkSum[1],
          parsedMessage[GSViewValuesEnum.numberOfMessages],
          parsedMessage[GSViewValuesEnum.messageNumber],
          parsedMessage[GSViewValuesEnum.totalNumberSatInView]);
        for (let index = 0; index < 4; index++) {
          message.satellites.push(new Satellite(
            parsedMessage[oneSatelliteValuesEnum.idNumber + (index*4)],
            parsedMessage[oneSatelliteValuesEnum.elevation + (index*4)],
            parsedMessage[oneSatelliteValuesEnum.azimuth + (index*4)],
            parsedMessage[oneSatelliteValuesEnum.snr + (index*4)]));
        }

      }

      if (parsedMessage[0] === '$GPGSA') {
        let idsOfUsedSats = [];
        for (let i = 0; i < 12; i++) {
          idsOfUsedSats.push(parsedMessage[GSActiveValuesEnum.idsOfUsedSats + i]);
        }
        message = new GSActiv(parsedMessage[GSActiveValuesEnum.messageType],
          checkSum[0],
          checkSum[1],
          parsedMessage[GSActiveValuesEnum.satAcuisitionMode],
          parsedMessage[GSActiveValuesEnum.positioningMode],
          idsOfUsedSats,
          parsedMessage[GSActiveValuesEnum.pdop],
          parsedMessage[GSActiveValuesEnum.hdop],
          parsedMessage[GSActiveValuesEnum.hdop]);
      }
      /* if (parsedMessage[0] === '$GPGSA') {
        message = new GSActiv(parsedMessage[GSActiveValuesEnum.messageType],
          checkSum[0],
          checkSum[1],
          parsedMessage[GSActiveValuesEnum.satAcuisitionMode],
          parsedMessage[GSActiveValuesEnum.positioningMode],
          [parsedMessage[GSActiveValuesEnum.idsOfUsedSats], parsedMessage[4], parsedMessage[5],
            parsedMessage[6], parsedMessage[7], parsedMessage[8], parsedMessage[9],
            parsedMessage[10], parsedMessage[11], parsedMessage[12]
          ],
          parsedMessage[GSActiveValuesEnum.pdop],
          parsedMessage[GSActiveValuesEnum.hdop],
          parsedMessage[GSActiveValuesEnum.hdop]);
      } */

      messages.push(message);

    });


    let messageCounter = 0;

    intervalIds.push( new SocketIdNIntervalId(socket.id, setInterval(function () {
      if (messageCounter + 1 < messages.length) {
        let currentSocket = io.sockets.connected[socket.id];
        if(currentSocket)
        {
          currentSocket.emit('recieve message', JSON.stringify(messages[messageCounter]));
        }     
        messageCounter++;
      }
    }, 50)));

    // event is emitted after each line

    /*   setTimeout(()=> console.log('Line from file:', line), 4000); */

    /* setTimeout()
    console.log('Line from file:', line);
    io.emit('recieve message', );
    setTimeout() */

    socket.on('stop send messages', function () {
      let intervalIdIndex = intervalIds.findIndex(i => i.socketId == socket.id);
      if(intervalIdIndex != -1)
      {
        clearInterval(intervalIds[intervalIdIndex].intervalId);
        intervalIds.splice(intervalIdIndex, 1);
      } 
    });
  });
});
/* "asdgyasd, asdasidhasud, asuidhasuidh,".split(",").forEach( v => v.trim()); */
http.listen(3000, function () {
  /* contents = fs.readFileSync('DATA', 'utf8'); */
  console.log('listening on *:3000');
});


class NmeaMessage {

  constructor(messageType, stringToCheck, checkSum) {
    this.messageType = messageType;
    this.stringToCheck = stringToCheck;
    this.checkSum = checkSum;
  }

}

class GSView extends NmeaMessage {

  constructor
    (
      messageType,
      stringToCheck,
      checkSum,
      numberOfMessages,
      messageNumber,
      totalNumberSatInView

    ) {
      super(messageType, stringToCheck, checkSum);
      this.numberOfMessages = numberOfMessages;
      this.messageNumber = messageNumber;
      this.totalNumberSatInView = totalNumberSatInView;

      //For each visible satellite (four groups per message):
      this.satellites = [];


    }
}

//mark current satellites (used for position calculation).
class GSActiv extends NmeaMessage {

  constructor
    (
      messageType,
      stringToCheck,
      checkSum,
      satAcuisitionMode,
      positioningMode,
      idsOfUsedSats,
      pdop,
      hdop,
      vdop

    ) {
      super(messageType, stringToCheck, checkSum);

      //satellite acquisition mode 
      //M =manual 
      //A =automatic (auto switch 2D/3D)
      this.satAcuisitionMode = satAcuisitionMode;

      //positioning mode
      //1 =fix not available 
      //2 =2D
      //3 =3D
      this.positioningMode = positioningMode;
      this.idsOfUsedSats = idsOfUsedSats;
      this.pdop = pdop;
      this.hdop = hdop;
      this.vdop = vdop;

    }
}

class Satellite {
  constructor(
    idNumber,
    elevation,
    azimuth,
    snr
  ) {
    this.idNumber = idNumber;

    this.elevation = elevation;
    this.azimuth = azimuth;

    this.snr = snr; // mark active satellites (for SNR field is not empty)
  }
}

class SocketIdNIntervalId
{
  constructor
  (
    socketId,
    intervalId
  )
  {
    this.socketId = socketId;
    this.intervalId = intervalId;
  }
}