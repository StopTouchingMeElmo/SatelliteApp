import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { SatelliteMessagesService } from './services/satellite_messages.servise';
import { Satellite, NmeaMessage, GSView, GSActiv } from './models/satellite';

import { MatDialog } from '@angular/material/dialog';
import { InfoComponent } from './info/info.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild('canvasForSatellites', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas', { static: true })
  canvasForSatellites: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  private ctxForSatellites: CanvasRenderingContext2D;
  activeSattellites: Array<Satellite>;


    dataSource: Object
    /**
     *
     */
    constructor(private satelliteMassageService: SatelliteMessagesService, public dialog: MatDialog) {

    }
   
    openDialog(): void {
       const dialogRef = this.dialog.open(InfoComponent, {
        width: '250px',
      });}

    ngOnInit(): void {
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.ctxForSatellites = this.canvasForSatellites.nativeElement.getContext('2d');

      for(var x = 0.5; x< 540; x += 10) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, 540);
    }

    for (var y = 0.5; y < 540; y += 10) {
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(540, y);
    }

    this.ctx.strokeStyle = 'lightgrey';
    this.ctx.stroke();

    //circle
    this.ctx.beginPath();
    this.ctx.arc(270, 270, 270, 0, 2 * Math.PI);
    this.ctx.strokeStyle = 'black';
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(270, 270, 135, 0, 2 * Math.PI);
    this.ctx.strokeStyle = 'black';
    this.ctx.stroke();

    this.dataSource = this.satelliteMassageService.chartRenderingInfo; // end of this.dataSource

  }

  /*  showCoords(event) {
     var x = event.clientX - 10;
     var y = event.clientY - 10;
     var coords = "X coordinates: " + x + ", Y coordinates: " + y;
     document.getElementById('showCoords').innerHTML = coords;
 
   } */

  startSendMessage() {
    this.satelliteMassageService.startSendMessage(this.ctxForSatellites);
  }

  stopSendMessage() {
    this.satelliteMassageService.stopSendMessage();
  }
}
