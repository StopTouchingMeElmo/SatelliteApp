const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');
const readline = require('readline');

let contents;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

let intervalId;
let rl;

io.on('connection', function(socket){
      socket.on('start send messages', function(){

        rl = readline.createInterface({
          input: fs.createReadStream('products.txt')
        });

        /* intervalId = setInterval(function() 
        { 
          contents
          io.emit('recieve message', ); 
        }, 4000 */

        // event is emitted after each line
        rl.on('line', function(line) {

          setTimeout()
          io.emit('recieve message', );
          setTimeout()
        });
      });
      socket.on('stop send messages', function(){
        clearInterval(intervalId);
      });
  });

io.emit('some event', { for: 'everyone' });

"asdgyasd, asdasidhasud, asuidhasuidh,".split(",").forEach( v => v.trim());
http.listen(3000, function(){
  contents = fs.readFileSync('DATA', 'utf8');
  console.log('listening on *:3000');
});


class NmeaMessage {

  constructor(messageType, checkSum) 
  { 
    this.messageType = messageType;
    this.checkSum = checkSum; 
  }

}

class GSView extends NmeaMessage {

  constructor
  (
    messageType, 
    checkSum,
    numberOfMessages,
    messageNumber,
    totalNumberSatInView,

    idNumber,
    elevation,
    azimuth,
    snr

  ) 
  { 
    super(messageType, checkSum);
    this.numberOfMessages = numberOfMessages;
    this.messageNumber = messageNumber;
    this.totalNumberSatInView = totalNumberSatInView;
   
    //For each visible satellite (four groups per message):
    this.idNumber = idNumber;

    this.elevation = elevation;
    this.azimuth = azimuth;

    this.snr = snr; // mark active satellites (for SNR field is not empty)
  }
}

//mark current satellites (used for position calculation).
class GSActiv extends NmeaMessage {

  constructor
  (
    messageType, 
    checkSum,
    satAcuisitionMode,
    positioningMode,
    idsOfUsedSats,
    pdop,
    hdop,
    vdop

  ) 
  { 
    super(messageType, checkSum);

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