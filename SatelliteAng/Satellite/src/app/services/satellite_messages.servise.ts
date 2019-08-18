import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators';
import { GSView, Satellite, NmeaMessage, GSActiv, SatelliteOnCanvas } from '../models/satellite';
import { Observable } from 'rxjs';
import { SignalRenderingInfo } from '../models/signal-rendering-info';

@Injectable({
    providedIn: 'root'
})
export class SatelliteMessagesService {

    constructor(private socket: Socket) { }

    public satellites: Array<Satellite | SatelliteOnCanvas> = new Array<SatelliteOnCanvas>();

    public signalRenderingInfo: Array<SignalRenderingInfo>;

    public chartRenderingInfo = {
        chart: {
          caption: "",
          subCaption: "",
          xAxisName: "",
          yAxisName: "",
          numberSuffix: "",
          theme: "fusion"
        },
        // Chart Data
        data: this.signalRenderingInfo
      }

    startSendMessage(canvasContext: CanvasRenderingContext2D) {
        this.socket.emit("start send messages");
        this.getMessage(canvasContext)
    }
    stopSendMessage() {
        this.socket.emit("stop send messages");
    }

    getMessage(canvasContext: CanvasRenderingContext2D) {
        this.socket.fromEvent<string>("recieve message").pipe(
            map(
                (data): NmeaMessage => {
                    if (data) {
                        return JSON.parse(data);                    
                    }
                }
            )
        ).subscribe
        (
            (m: NmeaMessage) => {
                if(m)
                {
                    if(m.checkSum)
                    {
                        let convertedCheckSum = 0;

                        let arrayToCheck = this.toUTF8Array(m.stringToCheck);
    
                        arrayToCheck.forEach( b => convertedCheckSum ^= b)
    
                        if(parseInt(m.checkSum,16) === convertedCheckSum)
                        {                   
                            if(m.messageType === '$GPGSV')
                            {
                                let gsView: GSView = m as GSView;
                                if(gsView.satellites && gsView.satellites.length > 0)
                                {
                                    gsView.satellites.forEach((s: Satellite) => {
                                        
                                        let satId = this.satellites.findIndex(sat => sat.idNumber === s.idNumber)
                                        if(satId != -1)
                                        {
                                            let setOnCanvas = this.satellites[satId] as SatelliteOnCanvas;
                                            canvasContext.save();
                                            canvasContext.beginPath();
                                            canvasContext.arc(setOnCanvas.xFormerState, setOnCanvas.yFormerState, 16, 0, 2 * Math.PI, true);
                                            canvasContext.clip();
                                            canvasContext.clearRect(setOnCanvas.xFormerState - 15, setOnCanvas.yFormerState - 15, 32, 32);
                                            canvasContext.restore();
                                            this.satellites.splice(satId, 1, s);                                                         
                                        }
                                        else{
                                            this.satellites.push(s);                               
                                        }
                                        this.chartRenderingInfo.data = this.satellites.map(s => new SignalRenderingInfo(s.idNumber.toString(), s.snr.toString()))
                                        this.chartRenderingInfo = this.chartRenderingInfo;
                                        let xny: { x: number, y: number } =  this.drawSatellites(canvasContext, s, 'black');
                                        let setOnCanvas = s as SatelliteOnCanvas;
                                        setOnCanvas.xFormerState = xny.x;
                                        setOnCanvas.yFormerState = xny.y;
                                    });                                                              
                                }
                            }
                            else if(m.messageType === '$GPGSA')
                            {
                                let gpgsA: GSActiv = m as GSActiv;
                                if(gpgsA.idsOfUsedSats && gpgsA.idsOfUsedSats.length > 0)
                                {
                                    let sats = this.satellites.filter( s => gpgsA.idsOfUsedSats.some(id => id === s.idNumber));
                                    if(sats || sats.length > 0)
                                    {
                                    sats.forEach( sat => this.drawSatellites(canvasContext, sat, 'red'));
                                    }
                             
                                }                                
                            } 
                            
                        }
                    }                
                }                   
              }
        );
    }

    private drawSatellites(canvasContext: CanvasRenderingContext2D, satellite: Satellite, color: string) : { x: number, y: number }
    {
        if(satellite)
        {
            let OA = (90 - satellite.elevation) * 3;
            let x = 270 + (OA * Math.cos(satellite.azimuth * (Math.PI/180)));
            let y = 270 - (OA * Math.sin(satellite.azimuth * (Math.PI/180)));
            canvasContext.beginPath();
            canvasContext.arc(x, y, 14, 0, 2 * Math.PI);
            canvasContext.fillStyle = color; 
            canvasContext.fill();
            
            canvasContext.font = '12px arial';
            canvasContext.strokeStyle = 'white';
            canvasContext.strokeText(satellite.idNumber.toString(), x - (satellite.idNumber > 99 ? 10 : 7), y + 3);
            
            return { x: x, y: y };
        }    
                    
    }

    private toUTF8Array(str) {
        let utf8 = [];
        for (let i = 0; i < str.length; i++) {
            let charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                          0x80 | (charcode & 0x3f));
            }
            else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                          0x80 | ((charcode>>6) & 0x3f),
                          0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                          | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >>18),
                          0x80 | ((charcode>>12) & 0x3f),
                          0x80 | ((charcode>>6) & 0x3f),
                          0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }

}