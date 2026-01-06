import { Injectable, inject, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { HttpClient } from '@angular/common/http';

// Placeholder config - User must replace this!
const firebaseConfig = {
  apiKey: "AIzaSyDummyKey",
  authDomain: "north-app.firebaseapp.com",
  projectId: "north-app",
  storageBucket: "north-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:dummy"
};

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private http = inject(HttpClient);
  
  // Signals
  permissionStatus = signal<NotificationPermission>('default');
  
  constructor() {
    // Check if supported
    if ('Notification' in window) {
      this.permissionStatus.set(Notification.permission);
    }
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      console.warn('This browser does not support desktop notification');
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const messaging = getMessaging(app);

      const permission = await Notification.requestPermission();
      this.permissionStatus.set(permission);

      if (permission === 'granted') {
        // VAPID key is optional if using default from firebase config, 
        // but often required: getToken(messaging, { vapidKey: 'YOUR_PUBLIC_VAPID_KEY_HERE' });
        // We'll try without or with a placeholder
        const currentToken = await getToken(messaging, { 
            vapidKey: 'BM_DUMMY_VAPID_KEY_REPLACE_ME' 
        });

        if (currentToken) {
          console.log('FCM Token:', currentToken);
          this.saveToken(currentToken);
        } else {
          console.warn('No registration token available. Request permission to generate one.');
        }
      }
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err);
    }
  }

  private saveToken(token: string) {
      this.http.post('/api/notifications/subscribe', { token }).subscribe({
          next: () => console.log('Token sent to server'),
          error: (e) => console.error('Error sending token to server', e)
      });
  }
}
