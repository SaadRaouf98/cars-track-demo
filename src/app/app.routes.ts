import { Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {TrackingComponent} from './tracking/tracking.component';
import {TrackingSimulationComponent} from './tracking-simulation/tracking-simulation.component';
import {ShowTrackingComponent} from './show-tracking/show-tracking.component';

export const routes: Routes = [
  // { path: '', component: AppComponent },
  { path: '', component: TrackingComponent },
  { path: 'tracking-simulation', component: TrackingSimulationComponent },
  { path: 'show-tracking', component: ShowTrackingComponent },
];
