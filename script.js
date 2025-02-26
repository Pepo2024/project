// ============= نظام التحميل =============
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.loader').classList.add('hidden');
  }, 2000);
});

// تهيئة Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD4NiKlU6SIJVxbnbk60SkRt8BNqlonk-U",
  authDomain: "mina-project-c10b2.firebaseapp.com",
  projectId: "mina-project-c10b2",
  storageBucket: "mina-project-c10b2.firebasestorage.app",
  messagingSenderId: "1088494592963",
  appId: "1:1088494592963:web:de6a787bc3b1694ccd1376"
};
firebase.initializeApp(firebaseConfig);

// متغيرات النظام
let attemptCount = 0;
const MAX_ATTEMPTS = 3;
const BAN_DURATION = 60000; // 1 دقيقة

// دالة كشف الجهاز
function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// ============= تسجيل الدخول بجوجل =============
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  if(isMobile()) {
    firebase.auth().signInWithRedirect(provider);
  } else {
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        handleAuthSuccess();
      })
      .catch(error => {
        showMessage("فشل تسجيل الدخول: " + error.message, "error");
      });
  }
}

// ============= تسجيل الدخول بفيسبوك =============
function facebookLogin() {
  const provider = new firebase.auth.FacebookAuthProvider();
  if(isMobile()) {
    firebase.auth().signInWithRedirect(provider);
  } else {
    firebase.auth().signInWithPopup(provider)
      .then(result => {
        handleAuthSuccess();
      })
      .catch(error => {
        showMessage("فشل تسجيل الدخول: " + error.message, "error");
      });
  }
}

// ============= تسجيل الدخول برقم الهاتف =============
let confirmationResult; // لتخزين نتيجة التحقق

function togglePhoneLogin() {
  const phoneForm = document.getElementById('phone-login-form');
  phoneForm.style.display = (phoneForm.style.display === 'none' || phoneForm.style.display === '') ? 'block' : 'none';
}

function sendPhoneCode() {
  const phoneNumber = document.getElementById('phone-number').value;
  if (!phoneNumber) {
    alert("الرجاء إدخال رقم الهاتف");
    return;
  }
  // إعداد reCAPTCHA
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': function(response) {
      console.log("reCAPTCHA تم حله");
    }
  });
  const appVerifier = window.recaptchaVerifier;
  firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then(function(result) {
      confirmationResult = result;
      alert("تم إرسال رمز التحقق");
    })
    .catch(function(error) {
      alert("خطأ في إرسال رمز التحقق: " + error.message);
    });
}

function verifyPhoneCode() {
  const code = document.getElementById('verification-code').value;
  if (!code) {
    alert("الرجاء إدخال رمز التحقق");
    return;
  }
  confirmationResult.confirm(code)
    .then(function(result) {
      // تم تسجيل الدخول بنجاح
      handleAuthSuccess();
    })
    .catch(function(error) {
      alert("رمز التحقق غير صحيح: " + error.message);
    });
}

// ============= معالجة حالة المصادقة =============
firebase.auth().getRedirectResult().then(result => {
  if(result.user) handleAuthSuccess();
}).catch(error => {
  showMessage("فشل تسجيل الدخول: " + error.message, "error");
});

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    handleAuthSuccess();
  } else {
    // يمكنك عرض واجهة تسجيل الدخول أو أي منطق آخر هنا
  }
});

function handleAuthSuccess() {
  closeLogin();
  alert("تم تسجيل الدخول بنجاح!");
  // يمكنك إعادة التوجيه أو تحديث الواجهة بما يتناسب مع حالة تسجيل الدخول
}

function showMessage(message, type) {
  alert(message);
}

// ============= شاشة البداية =============
let startY = 0;
const splash = document.querySelector('.splash-screen');

// التحكم بالسحب على الجوال
document.addEventListener('touchstart', e => {
  startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', e => {
  const currentY = e.touches[0].clientY;
  if (startY - currentY > 50) {
    splash.classList.add('hidden');
  }
});

// التحكم بالعجلة في الكمبيوتر
document.addEventListener('wheel', e => {
  if (e.deltaY < 0) {
    splash.classList.add('hidden');
  }
});

// النقر لإخفاء الشاشة
splash.addEventListener('click', () => {
  splash.classList.add('hidden');
});

// ============= نظام الآيات =============
const verses = [
  "«إِنَّ إِلهَ السَّمَاءِ يُعْطِينَا النَّجَاحَ، وَنَحْنُ عَبِيدُهُ نَقُومُ وَنَبْنِي» (نحميا 2: 20)",
  "«أَمَّا الْحِكْمَةُ فَنَافِعَةٌ لِلإِنْجَاحِ» (الجامعة 10: 10)",
  "«يَا سَيِّدُ، لِتَكُنْ أُذُنُكَ مُصْغِيَةً إِلَى صَلاَةِ عَبْدِكَ...» (نحميا 1: 11)",
  "«رُبَّ نَجَاحٍ يَكُونُ لأَذَى صَاحِبِهِ!» (يشوع بن سيراخ 20: 9)",
  "«بِهِ يُنْتَهِي إِلَى النَّجَاحِ، وَبِكَلِمَتِهِ يَقُومُ الْجَمِيعُ» (يشوع بن سيراخ 43: 28)"
];

let currentVerse = localStorage.getItem('currentVerse') || 0;

// تحديث الآية تلقائياً كل دقيقة
setInterval(() => {
  currentVerse = (parseInt(currentVerse) + 1) % verses.length;
  localStorage.setItem('currentVerse', currentVerse);
}, 60000);

// عرض الآية في المودال
function showVerse() {
  const modal = document.getElementById('verseModal');
  const content = document.getElementById('verseContent');
  content.textContent = verses[currentVerse];
  modal.classList.add('active');
}

function closeModal() {
  document.getElementById('verseModal').classList.remove('active');
}

// ============= الكرة القابلة للسحب =============
const draggableButton = document.getElementById('draggableButton');
let isDragging = false;
let currentX = 20;
let currentY = window.innerHeight - 80;
let initialX, initialY;

// تحديد المواقع الأولية
draggableButton.style.left = currentX + 'px';
draggableButton.style.top = currentY + 'px';

// إضافة جميع Event Listeners
draggableButton.addEventListener('mousedown', dragStart);
draggableButton.addEventListener('touchstart', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag);
document.addEventListener('mouseup', dragEnd);
document.addEventListener('touchend', dragEnd);

function dragStart(e) {
  isDragging = true;
  if (e.type === 'touchstart') {
    initialX = e.touches[0].clientX - currentX;
    initialY = e.touches[0].clientY - currentY;
  } else {
    initialX = e.clientX - currentX;
    initialY = e.clientY - currentY;
  }
}

function drag(e) {
  if (isDragging) {
    e.preventDefault();
    if (e.type === 'touchmove') {
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }
    setTranslate(currentX, currentY, draggableButton);
  }
}

function setTranslate(xPos, yPos, el) {
  const maxX = window.innerWidth - el.offsetWidth;
  const maxY = window.innerHeight - el.offsetHeight;
  xPos = Math.min(Math.max(0, xPos), maxX);
  yPos = Math.min(Math.max(0, yPos), maxY);
  el.style.left = xPos + 'px';
  el.style.top = yPos + 'px';
}

function dragEnd() {
  isDragging = false;
}

// النقر على الكرة لعرض الآية
draggableButton.addEventListener('click', function(e) {
  if (!isDragging) {
    const modal = document.getElementById('verseModal');
    modal.classList.contains('active') ? closeModal() : showVerse();
  }
});

// ============= القائمة الجانبية =============
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  menuToggle.classList.toggle('hidden');
});

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
    sidebar.classList.remove('active');
    menuToggle.classList.remove('hidden');
  }
});

// ============= نظام الوضع الليلي =============
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function toggleTheme() {
  const isDark = body.getAttribute('data-theme') === 'dark';
  body.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  updateThemeIcon();
}

function updateThemeIcon() {
  const isDark = body.getAttribute('data-theme') === 'dark';
  themeToggle.innerHTML = `<i class="fas ${isDark ? 'fa-moon' : 'fa-sun'}"></i> ${isDark ? 'الوضع الليلي' : 'الوضع النهاري'}`;
  
  document.querySelectorAll('.sidebar-image img').forEach(img => {
    img.style.display = isDark ? 
        (img.classList.contains('dark-image') ? 'block' : 'none') :
        (img.classList.contains('light-image') ? 'block' : 'none');
  });
}

// تحميل الوضع من الذاكرة المحلية
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon();

themeToggle.addEventListener('click', toggleTheme);

// ============= نظام تسجيل الدخول =============
function showLogin() {
  document.getElementById('loginModal').style.display = 'block';
}

function closeLogin() {
  document.getElementById('loginModal').style.display = 'none';
}

// إغلاق النافذة عند النقر خارجها
window.onclick = function(e) {
  const loginModal = document.getElementById('loginModal');
  if (e.target === loginModal) {
    loginModal.style.display = 'none';
  }
};

// تسجيل الدخول بالبريد الإلكتروني (يمكنك إضافة منطق المصادقة هنا)
document.querySelector('.email-login').addEventListener('submit', function(e) {
  e.preventDefault();
  const email = this.querySelector('input[type="email"]').value;
  const password = this.querySelector('input[type="password"]').value;
  
  console.log('جاري الدخول باستخدام:', email);
  // أضف منطق المصادقة هنا
});

// ============= التحكم بالرسوم المتحركة =============
// تحريك الأزرار عند التمرير
window.addEventListener('scroll', () => {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    const btnTop = btn.getBoundingClientRect().top;
    if (btnTop < window.innerHeight * 0.8) {
      btn.style.opacity = '1';
      btn.style.transform = 'translateY(0)';
    }
  });
});