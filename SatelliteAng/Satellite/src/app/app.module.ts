import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { FusionChartsModule } from "angular-fusioncharts";
import * as FusionCharts from "fusioncharts";
import * as Charts from "fusioncharts/fusioncharts.charts";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
FusionChartsModule.fcRoot(FusionCharts, Charts, FusionTheme);

import {MatDialogModule} from '@angular/material/dialog';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations'



import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:3000/', options: {} };

import { AppComponent } from './app.component';
import { SignalStrengthChartComponent } from './signal-strength-chart/signal-strength-chart.component';
import { InfoComponent } from './info/info.component';



@NgModule({
  declarations: [
    AppComponent,
    SignalStrengthChartComponent,
    InfoComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    SocketIoModule.forRoot(config),

    FormsModule,
    HttpClientModule,
    FusionChartsModule,

    MatDialogModule,
    BrowserAnimationsModule,
    NoopAnimationsModule

  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [InfoComponent]
})
export class AppModule { }
