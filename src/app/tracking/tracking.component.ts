import {Component, ViewChild} from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {GoogleMap, GoogleMapsModule, MapInfoWindow} from '@angular/google-maps';
import {faCar} from '@fortawesome/free-solid-svg-icons';
import {CommonModule} from '@angular/common';
import * as signalR from '@microsoft/signalr';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-tracking',
  imports: [RouterOutlet, GoogleMapsModule, CommonModule, RouterLink, TableModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent {
  @ViewChild(GoogleMap, {static: false}) map!: GoogleMap;
  @ViewChild(MapInfoWindow, {static: false}) info!: MapInfoWindow;
  private hubConnection!: signalR.HubConnection;
  zoom: number = 20;
  tipData: any;
  center!: google.maps.LatLngLiteral;
  myInterval:any;
  newData: any[] = [
        {lat:30.069790, long:31.346833},
        {lat:30.069757, long:31.346538},
        {lat:30.069702, long:31.346130},
        {lat:30.069700, long:31.345984},
        {lat:30.069653, long:31.345732},
        {lat:30.069665, long:31.345533},
        {lat:30.069655, long:31.345366},
        {lat:30.069643, long:31.344993},
        {lat:30.069580, long:31.344451},
        {lat:30.069550, long:31.344108},
        {lat:30.069520, long:31.343781},
        {lat:30.069497, long:31.343435},
        {lat:30.069460, long:31.343179},
        {lat:30.069435, long:31.342977},
        {lat:30.069414, long:31.342770},
        {lat:30.069377, long:31.342558},
        {lat:30.069358, long:31.342346},
        {lat:30.069323, long:31.341997},
        {lat:30.069314, long:31.341958},
        {lat:30.069289, long:31.341795},
        {lat:30.069275, long:31.341691},
        {lat:30.069251, long:31.341555},
        {lat:30.069233, long:31.341439},
        {lat:30.069232, long:31.341325},
        {lat:30.069226, long:31.341164},
        {lat:30.069260, long:31.340787},
      ];
  Data: any[] = [
    {
      id: 1,
      name: 'Nasir city',
      location: 'lat: 30.069790 | lng: 31.346833,',
    }
  ]
  optionsSingle: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    gestureHandling: 'cooperative',
    mapTypeId: google.maps.MapTypeId.HYBRID,
  };
  markers: any = [];
  arrayOfOptions: any[] = [];
  polylineOptions: any[] = []
  trackVehicleTypeName = '';

  // constructor
  constructor() {
    this.zoom = 20
    this.center = {
      lat: 30.069790,
      lng: 31.346833,
    };
    this.goTrack()
    this.startConnection()
  }
  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://65.108.233.18:4046/orderHub',
        {
          headers: {
            "Authorization":`Bearer ${this.getToken()}`
          }
        }
      )
      .withAutomaticReconnect()
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('Error while starting connection: ' + err));
  }
  public sendLocations(latitude: number, longitude: number): void {
    this.hubConnection
      .invoke("SendLocation", latitude, longitude)
      .catch(err => console.error('Error while sending Location: ' + err));
  }
  send(){
    let count = 0
    this.myInterval = setInterval(() => {
      this.sendLocations(this.newData[count].lat, this.newData[count].long)
      count++
      console.log(count)
      // if (count == this.newData.length) {
      //   clearInterval(this.myInterval)
      // }
    },500)

  }
  stopInterval() {
    clearInterval(this.myInterval)
  }
  getToken(): string {
    return 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhZG1pbiIsIlR5cGUiOiJBZG1pbiIsIkVtcGxveWVlSWQiOiIiLCJmYW1pbHlfbmFtZSI6IkVuZy8gQWhtZWQiLCJyb2xlIjoiYWRtaW4iLCJuYmYiOjE3MzM0MTA4NjMsImV4cCI6MTczMzQ1Mjg2MywiaWF0IjoxNzMzNDEwODYzfQ.Y7Kjkb1TJ2Sx40UR_jdvPXx9qGkb4xYPErLK3ycLHj3tRupKElsvvgygNOhjrCO_xcyPrMM4CiWAbJu_y-xSyw'
  }
  zooming() {}
  goTrack(){
    this.markers = [{
      position: {
        lat: 30.069790,
        lng: 31.346833,
      },
      label: {
        color: 'green',
      },
      info: {
        name: 'Nasir city',
        location: 'lat: 30.069790 | lng: 31.346833,',
      },
    }]
    for (let j = 0; j < this.markers.length; j++) {
      this.arrayOfOptions[j] = {
        draggable: false,
        icon: {
          fillColor: 'red',
          fillOpacity: 1,
          anchor: new google.maps.Point(
            faCar.icon[0], // width
            faCar.icon[1] // height
          ),
          strokeWeight: 1,
          strokeColor: 'red',
          scale: (this.zoom / 100) * 0.5,
        },
      };
    }
  }
  openInfo(marker: any, content: any) {
    this.tipData = content
    this.info.open(marker);
  }
}
