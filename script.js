// شاشة التحميل
setTimeout(() => {
    document.querySelector('.loader').classList.add('hidden');
}, 2000);

// التحكم في شاشة البداية
let startY = 0;
const splash = document.querySelector('.splash-screen');

document.addEventListener('touchstart', e => {
    startY = e.touches[0].clientY;
});

document.addEventListener('touchmove', e => {
    const currentY = e.touches[0].clientY;
    if (startY - currentY > 50) {
        splash.classList.add('hidden');
    }
});

document.addEventListener('wheel', e => {
    if (e.deltaY < 0) {
        splash.classList.add('hidden');
    }
});

splash.addEventListener('click', () => {
    splash.classList.add('hidden');
});

// نظام الآيات مع التخزين المحلي
const verses = [
    "«إِنَّ إِلهَ السَّمَاءِ يُعْطِينَا النَّجَاحَ، وَنَحْنُ عَبِيدُهُ نَقُومُ وَنَبْنِي» (نحميا 2: 20)",
    "«أَمَّا الْحِكْمَةُ فَنَافِعَةٌ لِلإِنْجَاحِ» (الجامعة 10: 10)",
    "«يَا سَيِّدُ، لِتَكُنْ أُذُنُكَ مُصْغِيَةً إِلَى صَلاَةِ عَبْدِكَ...» (نحميا 1: 11)",
    "«رُبَّ نَجَاحٍ يَكُونُ لأَذَى صَاحِبِهِ!» (يشوع بن سيراخ 20: 9)",
    "«بِهِ يُنْتَهِي إِلَى النَّجَاحِ، وَبِكَلِمَتِهِ يَقُومُ الْجَمِيعُ» (يشوع بن سيراخ 43: 28)"
];

// تهيئة القيمة الأولية من التخزين المحلي
let currentVerse = localStorage.getItem('currentVerse') || 0;
let verseInterval;

function updateVerse() {
    currentVerse = (currentVerse + 1) % verses.length;
    localStorage.setItem('currentVerse', currentVerse);
}

// تحديث الآية كل دقيقة (60000 مللي ثانية)
setInterval(updateVerse, 60000);

function showVerse() {
    const modal = document.getElementById('verseModal');
    const content = document.getElementById('verseContent');
    content.textContent = verses[currentVerse];
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('verseModal');
    modal.classList.remove('active');
}

// نظام السحب للكرة
const draggableButton = document.getElementById('draggableButton');
let isDragging = false;
let currentX = 20;
let currentY = window.innerHeight - 80;

draggableButton.style.left = currentX + 'px';
draggableButton.style.top = currentY + 'px';

draggableButton.addEventListener('mousedown', dragStart);
draggableButton.addEventListener('touchstart', dragStart);
document.addEventListener('mousemove', drag);
document.addEventListener('touchmove', drag);
document.addEventListener('mouseup', dragEnd);
document.addEventListener('touchend', dragEnd);

function dragStart(e) {
    if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX - currentX;
        initialY = e.touches[0].clientY - currentY;
    } else {
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
    }
    isDragging = true;
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

// التحكم في القائمة الجانبية
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
        sidebar.classList.remove('active');
        menuToggle.classList.remove('hidden');
    }
});

// نظام الوضع الليلي
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
}

// تهيئة الوضع من التخزين المحلي
const savedTheme = localStorage.getItem('theme') || 'dark';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon();

themeToggle.addEventListener('click', toggleTheme);

 // عند النقر على الكرة، إذا لم يكن السحب جارياً يتم فتح/إغلاق نافذة الآية
 draggableButton.addEventListener('click', function(e) {
    if (!isDragging) {
        const modal = document.getElementById('verseModal');
        if(modal.classList.contains('active')){
            closeModal();
        } else {
            showVerse();
        }
    }
});

function updateThemeIcon() {
    const isDark = body.getAttribute('data-theme') === 'dark';
    // تحديث أيقونة الزر
    themeToggle.innerHTML = `<i class="fas ${isDark ? 'fa-moon' : 'fa-sun'}"></i> ${isDark ? 'الوضع الليلي' : 'الوضع النهاري'}`;
    
    // تحديث الصور في القائمة
    document.querySelectorAll('.sidebar-image img').forEach(img => {
        img.style.display = 'none';
    });
    if(isDark) {
        document.querySelector('.dark-image').style.display = 'block';
    } else {
        document.querySelector('.light-image').style.display = 'block';
    }
}
