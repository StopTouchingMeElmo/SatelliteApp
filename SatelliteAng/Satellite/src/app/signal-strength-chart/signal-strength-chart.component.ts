import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-signal-strength-chart',
  templateUrl: './signal-strength-chart.component.html',
  styleUrls: ['./signal-strength-chart.component.css']
})
export class SignalStrengthChartComponent implements OnInit {


  @Input() dataSource: Object;

  constructor() {
    
  } // end of constructor

  ngOnInit() {
  }

}
