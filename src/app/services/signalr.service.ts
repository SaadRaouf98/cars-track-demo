import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private DomainUrl: string = 'http://65.108.233.18:4046/';

  // Example properties to hold received data
  receivedMessages: { latitude: string, longitude: string }[] = [];

  constructor() {}

  // Start connection and set up listeners
  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://65.108.233.18:4046/orderHub',
        {
          accessTokenFactory: () => this.getToken(), // Add token here
        }
        ) // Replace with your server URL
      .withAutomaticReconnect()
      .build();
    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected'))
      .catch(err => console.error('Error while starting connection: ' + err));
  }

  // Add listeners for server-sent messages
  public addLocationsListener(): void {
    this.hubConnection.on('ReceiveLocation', (latitude: string, longitude: string) => {
      this.receivedMessages.push({ latitude, longitude });
      console.log(`Location received: ${latitude}: ${longitude}`);
    });
  }

  // Send a message to the server
  public sendLocations(latitude: string, longitude: string): void {
    this.hubConnection
      .invoke("SendLocation", latitude, longitude)
      .catch(err => console.error('Error while sending Location: ' + err));
  }
  getToken(): string {
    return 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxIiwidW5pcXVlX25hbWUiOiJhZG1pbiIsIlR5cGUiOiJBZG1pbiIsIkVtcGxveWVlSWQiOiIiLCJmYW1pbHlfbmFtZSI6IkVuZy8gQWhtZWQiLCJyb2xlIjoiYWRtaW4iLCJuYmYiOjE3MzMzNDQzOTQsImV4cCI6MTczMzM4NjM5NCwiaWF0IjoxNzMzMzQ0Mzk0fQ.jDMNy9fFFab1rn0stH6uSkuqrpAoIDZZMKUUqakGekXyY7TNlJFoGmcEEvQ5Kyn2mNYtEOt73wC1nYUsMESgog'
  }
}
