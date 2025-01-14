import {Component, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {GoogleMap, GoogleMapsModule, MapInfoWindow} from '@angular/google-maps';
import {faCar} from '@fortawesome/free-solid-svg-icons';
import {CommonModule} from '@angular/common';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-show-tracking',
  imports: [RouterOutlet, GoogleMapsModule, CommonModule],
  templateUrl: './show-tracking.component.html',
  styleUrl: './show-tracking.component.scss'
})
export class ShowTrackingComponent {
  @ViewChild(GoogleMap, {static: false}) map!: GoogleMap;
  @ViewChild(MapInfoWindow, {static: false}) info!: MapInfoWindow;
  zoom: number = 18;
  center!: google.maps.LatLngLiteral;
  newData: any[] = []
  optionsSingle: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    gestureHandling: 'cooperative',
    mapTypeId: google.maps.MapTypeId.HYBRID,
  };
  markers: any = [];
  arrayOfOptions: any[] = [];
  polylineOptions: any
  trackVehicleTypeName = '';
  private hubConnection!: signalR.HubConnection;
  receivedPath: { lat: number, long: number }[] = [
    {
      lat: 30.069790,
      long: 31.346833,
    }
  ];
  // constructor
  constructor() {
    this.zoom = 18
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
      ) // Replace with your server URL
      .withAutomaticReconnect()
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('Error while starting connection: ' + err));
    this.hubConnection.on('ReceiveCarLocation', (lat: number, long: number) => {
      this.receivedPath.push({ lat, long });
      console.log(`Location received: ${lat}: ${long}`);
      console.log(this.receivedPath)
      this.goTrack()
    });
  }
  getToken(): string {
    return 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhZG1pbiIsIlR5cGUiOiJBZG1pbiIsIkVtcGxveWVlSWQiOiIiLCJmYW1pbHlfbmFtZSI6IkVuZy8gQWhtZWQiLCJyb2xlIjoiYWRtaW4iLCJuYmYiOjE3MzM0MTA4NjMsImV4cCI6MTczMzQ1Mjg2MywiaWF0IjoxNzMzNDEwODYzfQ.Y7Kjkb1TJ2Sx40UR_jdvPXx9qGkb4xYPErLK3ycLHj3tRupKElsvvgygNOhjrCO_xcyPrMM4CiWAbJu_y-xSyw'
  }
  goTrack(){
    let path: any = [];
    for (let i = 0; i < this.receivedPath.length; i++){
      path.push({
        lat: this.receivedPath[i]?.lat,
        lng: this.receivedPath[i]?.long,
      });
    }
    console.log(path, 'path')
    this.polylineOptions = {
      path: path,
      strokeColor: 'red',
      strokeOpacity: 1.0,
      strokeWeight: 10,
    };
    this.markers=[]
    this.markers.push({
      position: {
        lat: path[path.length - 1]?.lat,
        lng: path[path.length - 1]?.lng,
      },
      label: {
        color: 'green',
      },
      info: {
        name: 'Nasir city',
        location: 'lat: 30.069790 | lng: 31.346833,',
      },
    })
    this.center = {
      lat: path[path.length - 1]?.lat,
      lng: path[path.length - 1]?.lng,
    };
    for (let x = 0; x < this.markers.length; x++) {
      this.arrayOfOptions[x] = {
        draggable: false,
        icon: {
          path: faCar.icon[4] as string,
          fillColor: 'red',
          fillOpacity: 1,
          anchor: new google.maps.Point(
            faCar.icon[0], // width
            faCar.icon[1] // height
          ),
          strokeWeight: 1,
          strokeColor: 'red',
          scale: (this.zoom / 100) * 0.3,
        },
      };
    }
    console.log(this.markers.length, 'this.markers.length')
  }
  zooming() {
    let y: any = [];
    if (this.map.getZoom()) {
      y[0] = this.map.getZoom();
    }
    for (let j = 0; j < this.markers.length; j++) {
      this.arrayOfOptions[j] = {
        draggable: false,
        icon: {
          path: faCar.icon[4] as string,
          fillColor: 'red',
          fillOpacity: 1,
          anchor: new google.maps.Point(
            faCar.icon[0], // width
            faCar.icon[1] // height
          ),
          strokeWeight: 1,
          strokeColor: 'red',
          scale: (this.zoom / 100) * 0.3,
        },
      };
    }
  }

}
