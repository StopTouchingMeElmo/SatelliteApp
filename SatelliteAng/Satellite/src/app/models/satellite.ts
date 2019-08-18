export class NmeaMessage {

  constructor
    (
      public messageType: string,
      public stringToCheck: string,
      public checkSum: string
    ) {
  }

}

export class GSView extends NmeaMessage {

  constructor
    (
      messageType: string,
      stringToCheck: string,
      checkSum: string,
      public numberOfMessages,
      public messageNumber,
      public totalNumberSatInView

    ) {
    super(messageType, stringToCheck, checkSum)
  }

  public satellites;

}

export class Satellite {
  public idNumber: number;
  public elevation: number;
  public azimuth: number;
  public snr: number;
}

export class SatelliteOnCanvas extends Satellite
{
  xFormerState: number;
  yFormerState: number;
}

export class GSActiv extends NmeaMessage {

  constructor
    (
      messageType: string,
      stringToCheck: string,
      checkSum: string,
      public satAcuisitionMode: string,
      public positioningMode: number,
      public idsOfUsedSats: Array<number>,
      public pdop: number,
      public hdop: number,
      public vdop: number

    ) {
    super(messageType, stringToCheck, checkSum)
  }
}



