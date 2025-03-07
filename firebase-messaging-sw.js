importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyD4NiKlU6SIJVxbnbk60SkRt8BNqlonk-U",
  projectId: "mina-project-c10b2",
  messagingSenderId: "1088494592963",
  appId: "1:1088494592963:web:de6a787bc3b1694ccd1376"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/notification-icon.png'
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
