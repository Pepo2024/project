importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyD4NiKlU6SIJVxbnbk60SkRt8BNqlonk-U",
  authDomain: "mina-project-c10b2.firebaseapp.com",
  projectId: "mina-project-c10b2",
  storageBucket: "mina-project-c10b2.firebasestorage.app",
  messagingSenderId: "1088494592963",
  appId: "1:1088494592963:web:de6a787bc3b1694ccd1376"
});

const messaging = firebase.messaging();

// استقبال الرسائل في الخلفية
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] تم استلام رسالة في الخلفية ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };
  return self.registration.showNotification(notificationTitle, notificationOptions);
});
