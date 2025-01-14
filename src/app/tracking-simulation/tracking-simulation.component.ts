import {Component, ViewChild} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {GoogleMap, GoogleMapsModule, MapInfoWindow} from '@angular/google-maps';
import {faCar} from '@fortawesome/free-solid-svg-icons';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-tracking-simulation',
  imports: [RouterOutlet, GoogleMapsModule, CommonModule],
  templateUrl: './tracking-simulation.component.html',
  styleUrl: './tracking-simulation.component.scss'
})
export class TrackingSimulationComponent {
  @ViewChild(GoogleMap, {static: false}) map!: GoogleMap;
  @ViewChild(MapInfoWindow, {static: false}) info!: MapInfoWindow;
  title = 'cars-track-demo';
  zoom: number = 16;
  center!: google.maps.LatLngLiteral;
  newData: any[] = [
    {
      vehicleRoute: [
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
      ]
    },
    {
      vehicleRoute: [
        {lat:30.069647, long:31.346861},
        {lat:30.069626, long:31.346641},
        {lat:30.069597, long:31.346425},
        {lat:30.069586, long:31.346143},
        {lat:30.069543, long:31.345849},
        {lat:30.069531, long:31.345687},
        {lat:30.069497, long:31.345412},
        {lat:30.069473, long:31.345123},
        {lat:30.069442, long:31.344877},
        {lat:30.069412, long:31.344610},
        {lat:30.069392, long:31.344381},
        {lat:30.069352, long:31.344103},
        {lat:30.069331, long:31.343818},
        {lat:30.069294, long:31.343499},
        {lat:30.069247, long:31.343218},
        {lat:30.069225, long:31.342868},
        {lat:30.069184, long:31.342478},
        {lat:30.069164, long:31.342344},
        {lat:30.069138, long:31.342042},
        {lat:30.069101, long:31.341773},
        {lat:30.069083, long:31.341491},
        {lat:30.069061, long:31.341146},
        {lat:30.069067, long:31.340814},
        {lat:30.069047, long:31.340465},
        {lat:30.069008, long:31.340076},
      ]
    },
  ];
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
  infoContent: any;
  numberOfCar = '';
  trackVehicleTypeName = '';
  titleName: any;
  // constructor
  constructor() {
    this.zoom = 18
    this.center = {
      lat: 30.069790,
      lng: 31.346833,
    };
    this.goTrack()
  }
  goTrack(){
    let path: any = [];
    let count:any = []
    for (let i = 0; i < this.newData.length; i++){
      path.push([])
      this.markers.push({})
      this.polylineOptions.push({})
      count.push(-1)
      const myInterval = setInterval(() => {
        path[i].push({
          lat: parseFloat(this.newData[i]?.vehicleRoute[count[i] + 1]?.lat),
          lng: parseFloat(this.newData[i]?.vehicleRoute[count[i] + 1]?.long),
        });
        console.log(path[i])
        count[i] = count[i]+1
        if (count[i] == this.newData[i]?.vehicleRoute.length-1){
          clearInterval(myInterval)
        }

        this.polylineOptions[i] = {
          path: path[i],
          strokeColor: 'red',
          strokeOpacity: 1.0,
          strokeWeight: 10,
        };

        this.markers[i] = {
          position: {
            lat: parseFloat(path[i][path[i].length - 1]?.lat),
            lng: parseFloat(path[i][path[i].length - 1]?.lng),
          },
          label: {
            color: 'green',
          },
          info: {
            id: this.newData[i]?.id,
            number: this.newData[i]?.number,
            trackVehicleTypeName: this.newData[i]?.trackVehicleTypeName,
          },
        };
        this.center = {
          lat: path[i][path[i].length - 1]?.lat,
          lng: path[i][path[i].length - 1]?.lng,
        };
        }, 500)
    }
    for (let j = 0; j < this.markers.length; j++) {
      this.arrayOfOptions[j] = {
        draggable: false,
        icon: {
          path: faCar.icon[4] as string,
          fillColor: this.getRandomColor(),
          fillOpacity: 1,
          anchor: new google.maps.Point(
            faCar.icon[0], // width
            faCar.icon[1] // height
          ),
          strokeWeight: 1,
          strokeColor: this.getRandomColor(),
          scale: (this.zoom / 100) * 0.5,
        },
      };
    }
    console.log(this.newData.length, 'this.markers.length')
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
          fillColor: this.getRandomColor(),
          fillOpacity: 1,
          anchor: new google.maps.Point(
            faCar.icon[0], // width
            faCar.icon[1] // height
          ),
          strokeWeight: 1,
          strokeColor: this.getRandomColor(),
          scale: (this.zoom / 100) * 0.3,
        },
      };
    }
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
