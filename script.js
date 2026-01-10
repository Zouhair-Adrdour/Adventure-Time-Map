// بيانات المواقع (يمكن توسيعها لاحقاً)
// ===== نظام الإنجازات =====
const AchievementSystem = {
    achievements: {
        firstClick: {
            name: 'المستكشف الجديد',
            description: 'النقر الأول على الخريطة',
            unlocked: false,
            points: 10,
            icon: '🗺️'
        },
        visitedAll: {
            name: 'رحالة أوو',
            description: 'زيارة جميع المواقع',
            unlocked: false,
            points: 50,
            icon: '🏆'
        },
        foundSecret: {
            name: 'الباحث عن الأسرار',
            description: 'إيجاد جميع الكنوز',
            unlocked: false,
            points: 30,
            icon: '🔍'
        },
        multilingual: {
            name: 'متعدد اللغات',
            description: 'تغيير اللغة',
            unlocked: false,
            points: 20,
            icon: '🌐'
        }
    },

    points: 0,
    visitedLocations: new Set(),

    init() {
        this.loadProgress();
        this.setupEventListeners();
    },

    unlock(achievementKey) {
        if (this.achievements[achievementKey] && !this.achievements[achievementKey].unlocked) {
            this.achievements[achievementKey].unlocked = true;
            this.points += this.achievements[achievementKey].points;
            this.showNotification(this.achievements[achievementKey]);
            this.saveProgress();
            return true;
        }
        return false;
    },

    showNotification(achievement) {
        const notif = document.createElement('div');
        notif.className = 'achievement-notif';
        notif.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 2rem;">${achievement.icon}</span>
                <div>
                    <strong style="color: var(--primary-color);">${achievement.name}</strong><br>
                    <small>+${achievement.points} نقطة</small>
                </div>
            </div>
        `;

        document.body.appendChild(notif);

        // إزالة الإشعار بعد 5 ثواني
        setTimeout(() => {
            notif.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => notif.remove(), 300);
        }, 5000);
    },

    saveProgress() {
        const data = {
            achievements: this.achievements,
            points: this.points,
            visitedLocations: Array.from(this.visitedLocations)
        };
        localStorage.setItem('ooo_achievements', JSON.stringify(data));
    },

    loadProgress() {
        const saved = localStorage.getItem('ooo_achievements');
        if (saved) {
            const data = JSON.parse(saved);
            this.achievements = data.achievements || this.achievements;
            this.points = data.points || 0;
            this.visitedLocations = new Set(data.visitedLocations || []);
        }
    },

    setupEventListeners() {
        // تتبع النقر على المواقع
        document.querySelectorAll('.location-point').forEach(point => {
            point.addEventListener('click', () => {
                const locationId = point.id;
                this.visitedLocations.add(locationId);

                // فتح إنجاز أول زيارة
                if (this.visitedLocations.size === 1) {
                    this.unlock('firstClick');
                }

                // فتح إنجاز زيارة جميع المواقع
                const allLocations = document.querySelectorAll('.location-point').length;
                if (this.visitedLocations.size === allLocations) {
                    this.unlock('visitedAll');
                }

                this.saveProgress();
            });
        });
    }
};

// ===== خريطة تكبير وتصغير =====
class InteractiveMap {
    constructor() {
        this.zoomLevel = 1;
        this.maxZoom = 3;
        this.minZoom = 0.5;
        this.mapElement = document.getElementById('ooo-map');
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.translateX = 0;
        this.translateY = 0;

        if (this.mapElement) {
            this.init();
        }
    }

    init() {
        this.createControls();
        this.setupEventListeners();
        this.mapElement.style.cursor = 'grab';
    }

    createControls() {
        const controls = document.createElement('div');
        controls.className = 'map-controls';
        controls.innerHTML = `
            <button class="zoom-in" title="تكبير"><i class="fas fa-plus"></i></button>
            <button class="zoom-out" title="تصغير"><i class="fas fa-minus"></i></button>
            <button class="reset-view" title="إعادة تعيين"><i class="fas fa-sync-alt"></i></button>
        `;

        this.mapElement.parentElement.appendChild(controls);

        // أحداث الأزرار
        controls.querySelector('.zoom-in').addEventListener('click', () => this.zoom(0.2));
        controls.querySelector('.zoom-out').addEventListener('click', () => this.zoom(-0.2));
        controls.querySelector('.reset-view').addEventListener('click', () => this.reset());
    }

    zoom(delta) {
        this.zoomLevel = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoomLevel + delta));
        this.updateTransform();
    }

    reset() {
        this.zoomLevel = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateTransform();
    }

    updateTransform() {
        this.mapElement.style.transform = `
            scale(${this.zoomLevel})
            translate(${this.translateX}px, ${this.translateY}px)
        `;
    }

    setupEventListeners() {
        // تكبير بالماوس
        this.mapElement.addEventListener('wheel', (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                this.zoom(delta);
            }
        });

        // سحب الخريطة
        this.mapElement.addEventListener('mousedown', (e) => {
            if (e.target.closest('.location-point') || e.target.closest('.map-controls')) return;

            this.isDragging = true;
            this.startX = e.clientX - this.translateX;
            this.startY = e.clientY - this.translateY;
            this.mapElement.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;

            this.translateX = e.clientX - this.startX;
            this.translateY = e.clientY - this.startY;
            this.updateTransform();
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
            this.mapElement.style.cursor = 'grab';
        });

        // لمنع السحب على الهواتف
        this.mapElement.addEventListener('touchstart', (e) => {
            if (e.target.closest('.location-point')) return;
            e.preventDefault();
        }, { passive: false });
    }
}

// ===== لعبة البحث عن الكنز =====
class TreasureHunt {
    constructor() {
        this.treasures = [
            { id: 'sword', name: 'سيف فين المفقود', points: 100, icon: '🗡️', color: '#06d6a0' },
            { id: 'crown', name: 'تاج الأميرة', points: 150, icon: '👑', color: '#ff006e' },
            { id: 'gem', name: 'جوهرة جايك السحرية', points: 200, icon: '💎', color: '#ffd166' }
        ];

        this.hiddenTreasures = [];
        this.foundTreasures = new Set();
        this.isActive = false;

        this.init();
    }

    init() {
        this.loadProgress();
        this.createStartButton();
    }

    createStartButton() {
        const btn = document.querySelector('.treasure-hunt-btn');
        if (!btn) return;

        btn.addEventListener('click', () => {
            if (!this.isActive) {
                this.startGame();
            } else {
                this.showFoundTreasures();
            }
        });
    }

    startGame() {
        this.isActive = true;
        this.hideTreasures();

        // تغيير نص الزر
        const btn = document.querySelector('.treasure-hunt-btn');
        btn.innerHTML = '<i class="fas fa-search"></i> <span class="btn-text">الكشف عن الكنوز</span>';

        this.showInstructions();
    }

    hideTreasures() {
        const locations = document.querySelectorAll('.location-point');

        // تنظيف أي كنوز سابقة
        document.querySelectorAll('.treasure-marker').forEach(marker => marker.remove());

        this.hiddenTreasures = [];
        this.treasures.forEach(treasure => {
            const availableLocations = Array.from(locations).filter(loc =>
                !this.hiddenTreasures.some(t => t.locationId === loc.id)
            );

            if (availableLocations.length > 0) {
                const randomLoc = availableLocations[Math.floor(Math.random() * availableLocations.length)];
                this.hiddenTreasures.push({
                    treasure: treasure,
                    locationId: randomLoc.id,
                    element: randomLoc
                });

                this.createTreasureMarker(randomLoc, treasure);
            }
        });
    }

    createTreasureMarker(locationElement, treasure) {
        const marker = document.createElement('div');
        marker.className = 'treasure-marker';
        marker.dataset.treasureId = treasure.id;
        marker.innerHTML = treasure.icon;
        marker.style.color = treasure.color;

        locationElement.appendChild(marker);

        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            this.findTreasure(treasure.id, marker);
        });
    }

    findTreasure(treasureId, marker) {
        if (this.foundTreasures.has(treasureId)) return;

        const treasure = this.treasures.find(t => t.id === treasureId);
        if (treasure) {
            this.foundTreasures.add(treasureId);
            marker.style.animation = 'none';
            marker.style.transform = 'scale(2)';

            // إضافة النقاط
            AchievementSystem.points += treasure.points;
            AchievementSystem.saveProgress();

            // إظهار رسالة النجاح
            this.showTreasureFound(treasure);

            // فتح إنجاز إذا وجد جميع الكنوز
            if (this.foundTreasures.size === this.treasures.length) {
                AchievementSystem.unlock('foundSecret');
            }

            this.saveProgress();
        }
    }

    showTreasureFound(treasure) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="text-align: center;">
                <h2 style="color: ${treasure.color};">🎉 وجدت كنزاً!</h2>
                <div style="font-size: 5rem; margin: 20px 0;">${treasure.icon}</div>
                <h3>${treasure.name}</h3>
                <p style="font-size: 1.2rem; background: #f0f0f0; padding: 10px; border-radius: 10px;">
                    +${treasure.points} نقطة
                </p>
                <p style="margin-top: 20px; color: #666;">
                    بقي ${this.treasures.length - this.foundTreasures.size} كنوز للعثور عليها
                </p>
                <button class="close-modal" style="
                    margin-top: 20px;
                    padding: 10px 30px;
                    background: ${treasure.color};
                    color: white;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    أكمل البحث!
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
    }

    showInstructions() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>🔍 البحث عن الكنوز</h2>
                <p>الهدف: ابحث عن 3 كنوز مخبأة في الخريطة</p>
                <ul style="text-align: right; margin: 20px 0;">
                    <li>🗡️ سيف فين المفقود</li>
                    <li>👑 تاج الأميرة</li>
                    <li>💎 جوهرة جايك السحرية</li>
                </ul>
                <p>انقر على العلامات الذهبية المتلألئة للعثور على الكنوز!</p>
                <button class="start-game-btn" style="
                    padding: 10px 30px;
                    background: #ffd166;
                    border: none;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 20px;
                ">
                    ابدأ المغامرة!
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        modal.querySelector('.start-game-btn').addEventListener('click', () => {
            modal.remove();
        });
    }

    saveProgress() {
        const data = {
            foundTreasures: Array.from(this.foundTreasures),
            isActive: this.isActive
        };
        localStorage.setItem('ooo_treasures', JSON.stringify(data));
    }

    loadProgress() {
        const saved = localStorage.getItem('ooo_treasures');
        if (saved) {
            const data = JSON.parse(saved);
            this.foundTreasures = new Set(data.foundTreasures || []);
            this.isActive = data.isActive || false;

            if (this.isActive) {
                this.startGame();
            }
        }
    }
}
const locationsData = {
    'candy-kingdom': {
        name: 'مملكة الحلوى',
        color: '#ff006e',
        icon: '🍬',
        description: 'قلب أرض أوو الحلو! هنا تحكم الأميرة صمغ بعقلها العلمي وقلبها الحلوي. كل شيء هنا مصنوع من الحلوى، ولكن لا تأكل المباني!',
        residents: [
            { name: 'الأميرة صمغ', icon: '👑', color: '#ff006e' },
            { name: 'كيك', icon: '🧁', color: '#ff8fab' },
            { name: 'إيرل أوفليمونجراد', icon: '🍋', color: '#ffd166' }
        ],
        funFact: 'مملكة الحلوى تم بناؤها من لعاب الأميرة صمغ!'
    },
    'tree-fort': {
        name: 'بيت فين وجايك',
        color: '#06d6a0',
        icon: '🌳',
        description: 'المنزل الشجري الأكثر رياضية في الكون! هنا يعيش فين وجايك ويخططون لمغامراتهم اليومية. يحتوي على سرير واحد فقط، لكن جايك يمكنه أن يصبح أي أثاث.',
        residents: [
            { name: 'فين', icon: '🗡️', color: '#06d6a0' },
            { name: 'جايك', icon: '🐶', color: '#ffd166' },
            { name: 'بي إم أو', icon: '📺', color: '#118ab2' }
        ],
        funFact: 'الشجرة تنمو بشكل سحري وتضيف غرفاً جديدة عندما يحتاج الأبطال لذلك!'
    },
    'ice-kingdom': {
        name: 'مملكة الجليد',
        color: '#118ab2',
        icon: '🧊',
        description: 'قلعة جليدية متلألئة يسكنها ملك الجليد وحيداً. مليئة بالبنسوينز المسحورة وآلات كتابة الروايات الرومانسية.',
        residents: [
            { name: 'ملك الجليد', icon: '👑', color: '#118ab2' },
            { name: 'غونتر', icon: '🐧', color: '#073b4c' },
            { name: 'بنسوينز', icon: '🐧🐧🐧', color: '#a2d2ff' }
        ],
        funFact: 'تاج ملك الجليد هو مصدر قوته السحرية، لكنه أيضاً سبب جنونه.'
    },
    'fire-kingdom': {
        name: 'أرض النار',
        color: '#ef476f',
        icon: '🔥',
        description: 'مملكة من اللهب والنار، يحكمها نبلاء النار. المكان حار جداً لدرجة أن الزبدة تذوب من على بعد أميال!',
        residents: [
            { name: 'الأميرة لهب', icon: '👑', color: '#ef476f' },
            { name: 'فليم', icon: '🔥', color: '#ff9e00' },
            { name: 'إيرل النار', icon: '👨‍🚒', color: '#ff5400' }
        ],
        funFact: 'سكان أرض النار يمكنهم التحكم في درجة حرارة مشاعرهم حرفياً!'
    },
    'nightosphere': {
        name: 'عالم الظلام',
        color: '#7209b7',
        icon: '🌑',
        description: 'بعد مظلم وكئيب يسكنه الشياطين والكائنات الغريبة. هو عالم مارسيلين الأصلي، لكن لا تذهب هناك بدون دعوة!',
        residents: [
            { name: 'هانسن أباديير', icon: '😈', color: '#7209b7' },
            { name: 'مارسيلين', icon: '🧛', color: '#3a0ca3' },
            { name: 'شياطين متنوعة', icon: '👹', color: '#4361ee' }
        ],
        funFact: 'قواعد الفيزياء مختلفة في عالم الظلام - يمكن للسكان التمدد والتقلص بشكل غريب!'
    }
};

// بيانات الشخصيات
const charactersData = {
    'finn': {
        name: 'فين',
        title: 'البطل البشري الأخير',
        description: 'فين هو صبي مغامر بشري يبلغ من العمر 16 عاماً. رياضيّ، شجاع، ويحب المغامرات والعدالة. يحمل سيفاً سحرياً ويكره الشر.',
        catchphrase: 'رياضيّ!',
        color: '#06d6a0'
    },
    'jake': {
        name: 'جايك',
        title: 'الكلب السحري',
        description: 'جايك هو كلب سحري يمكنه التمدد والتقلص وتغيير شكله. هو الأخ الأكبر لفين وأكثر حكمة مما يبدو. يحب النوم والأكل.',
        catchphrase: 'يا رجل...',
        color: '#ffd166'
    },
    'pb': {
        name: 'الأميرة صمغ',
        title: 'حاكمة مملكة الحلوى',
        description: 'عالمة عبقرة وعادلة. عمرها 827 عاماً وتحكم مملكة الحلوى بحكمة. تجري تجارب علمية وقد تكون باردة المشاعر أحياناً.',
        catchphrase: 'هذا مثير علمياً!',
        color: '#ff006e'
    },
    'ice-king': {
        name: 'ملك الجليد',
        title: 'ساحر الجليد الوحيد',
        description: 'ملك جليد مجنون يسكن قلعة ثلجية. يخطف الأميرات ظناً منه أنهن سيتزوجنه. في الحقيقة، هو شخصية مأساوية تبحث عن الحب.',
        catchphrase: 'أريد زوجة!',
        color: '#118ab2'
    }
};

// العناصر الأساسية في DOM
const locationPoints = document.querySelectorAll('.location-point');
const infoPanel = document.getElementById('info-panel');
const locationInfo = document.getElementById('location-info');
const defaultMessage = document.querySelector('.default-message');
const closeBtn = document.getElementById('close-btn');
const characterCards = document.querySelectorAll('.character-card');

// دالة لعرض معلومات الموقع
function showLocationInfo(locationId) {
    const location = locationsData[locationId];

    if (!location) return;

    // إخفاء الرسالة الافتراضية
    defaultMessage.style.display = 'none';

    // إظهار معلومات الموقع
    locationInfo.innerHTML = `
        <div class="location-header">
            <div class="location-icon" style="background-color: ${location.color}">
                <span style="font-size: 2rem;">${location.icon}</span>
            </div>
            <div>
                <h3 style="color: ${location.color}">${location.name}</h3>
                <p><em>${location.funFact}</em></p>
            </div>
        </div>
        
        <div class="location-description">
            <p>${location.description}</p>
        </div>
        
        <h4><i class="fas fa-users"></i> سكان بارزون:</h4>
        ${location.residents.map(resident => `
            <div class="resident">
                <div class="resident-icon" style="background-color: ${resident.color}">
                    <span style="font-size: 1.5rem;">${resident.icon}</span>
                </div>
                <span><strong>${resident.name}</strong></span>
            </div>
        `).join('')}
    `;

    // إظهار القسم
    locationInfo.classList.add('active');
    infoPanel.style.transform = 'scale(1.05)';
    setTimeout(() => {
        infoPanel.style.transform = 'scale(1)';
    }, 300);

    // تأثير صوتي بسيط (يمكن إضافة صوت لاحقاً)
    playClickSound();
}

// دالة لعرض معلومات الشخصية
function showCharacterInfo(characterId) {
    const character = charactersData[characterId];

    if (!character) return;

    // إخفاء الرسالة الافتراضية
    defaultMessage.style.display = 'none';

    // إظهار معلومات الشخصية
    locationInfo.innerHTML = `
        <div class="location-header">
            <div class="location-icon" style="background-color: ${character.color}">
                <span style="font-size: 2rem;">${characterId === 'finn' ? '🗡️' :
            characterId === 'jake' ? '🐶' :
                characterId === 'pb' ? '👑' : '🧊'}</span>
            </div>
            <div>
                <h3 style="color: ${character.color}">${character.name}</h3>
                <p><strong>${character.title}</strong></p>
            </div>
        </div>
        
        <div class="location-description">
            <p>${character.description}</p>
            <div style="margin-top: 15px; padding: 10px; background-color: ${character.color}22; border-radius: 10px;">
                <p><strong>كلمته الشهيرة:</strong> "<em>${character.catchphrase}</em>"</p>
            </div>
        </div>
        
        <div style="margin-top: 20px; text-align: center;">
            <button class="fun-btn" onclick="showRandomFact('${characterId}')" style="background-color: ${character.color}">
                <i class="fas fa-star"></i> حقيقة عشوائية
            </button>
        </div>
    `;

    // إظهار القسم
    locationInfo.classList.add('active');
}

// دالة لعرض حقيقة عشوائية
function showRandomFact(characterId) {
    const facts = {
        'finn': [
            'فين فقد ذراعه عدة مرات لكنها تنمو مجدداً!',
            'عمره الحقيقي 16 سنة لكنه بدأ المغامرات منذ كان عمره 12 سنة.',
            'اسمه الكامل هو "فين ميرتنس" ولكنه لا يعرف والديه.'
        ],
        'jake': [
            'جايك عمره 28 سنة (بسنوات الكلاب) لكنه سحري لذا لا يشيخ.',
            'يمكنه التمدد حتى يصل حجمه إلى حجم بناء ضخم!',
            'لديه 5 أطفال سحريين مع سيدة المطر.'
        ],
        'pb': [
            'الأميرة صمغ عمرها 827 سنة!',
            'هي في الحقيقة ليست من الحلوى بل كائن تجريبي.',
            'أسلوب حكمها يمكن أن يكون استبدادياً أحياناً.'
        ],
        'ice-king': [
            'اسمه الحقيقي سيمون بيتريكوف وكان عالم آثار.',
            'تاجه السحري هو ما يبقيه على قيد الحياة لكنه أيضاً يجننه.',
            'كان مخطوباً لفتاة اسمها بيتريشيا قبل أن يصبح ملك الجليد.'
        ]
    };

    const characterFacts = facts[characterId] || ['لا توجد معلومات إضافية حالياً.'];
    const randomFact = characterFacts[Math.floor(Math.random() * characterFacts.length)];

    alert(`✨ حقيقة ممتعة:\n\n${randomFact}`);
}

// دالة لتأثير صوت النقر (بسيط)
function playClickSound() {
    // يمكن إضافة صوت حقيقي لاحقاً
    console.log('نقرة! (أضف صوتاً لاحقاً)');
}

// إضافة المستمعين للأحداث
// عند النقر على موقع
locationPoints.forEach(point => {
    point.addEventListener('click', function () {
        const locationId = this.id;
        showLocationInfo(locationId);

        // إضافة تأثير على النقطة التي نُقرت
        this.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 300);
    });
});

// عند النقر على شخصية
characterCards.forEach(card => {
    card.addEventListener('click', function () {
        const characterId = this.dataset.character;
        showCharacterInfo(characterId);

        // تأثير على البطاقة
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
});

// زر الإغلاق
closeBtn.addEventListener('click', function () {
    locationInfo.classList.remove('active');
    defaultMessage.style.display = 'block';
    infoPanel.style.transform = 'scale(0.95)';
    setTimeout(() => {
        infoPanel.style.transform = 'scale(1)';
    }, 300);
});

// رسالة ترحيبية عند التحميل
window.addEventListener('load', function () {
    console.log('🏰 مرحباً في أرض أوو! ابدأ مغامرتك!');

    // تأثير دخول بسيط
    document.querySelector('.map').style.opacity = '0';
    document.querySelector('.map').style.transform = 'translateY(20px)';

    setTimeout(() => {
        document.querySelector('.map').style.transition = 'all 1s ease';
        document.querySelector('.map').style.opacity = '1';
        document.querySelector('.map').style.transform = 'translateY(0)';
    }, 500);
});

// تأثيرات إضافية عند المرور على النقاط
locationPoints.forEach(point => {
    point.addEventListener('mouseenter', function () {
        const pointCircle = this.querySelector('.point');
        pointCircle.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
    });

    point.addEventListener('mouseleave', function () {
        const pointCircle = this.querySelector('.point');
        pointCircle.style.boxShadow = 'none';
    });
});

// أزرار إضافية
document.addEventListener('DOMContentLoaded', function () {
    // إضافة زر مغامرة عشوائية
    const header = document.querySelector('header');
    const adventureBtn = document.createElement('button');
    adventureBtn.innerHTML = '<i class="fas fa-dice"></i> مغامرة عشوائية';
    adventureBtn.className = 'adventure-btn';
    adventureBtn.style.cssText = `
        margin-top: 15px;
        padding: 10px 20px;
        background: linear-gradient(45deg, #ff006e, #7209b7);
        color: white;
        border: none;
        border-radius: 50px;
        font-family: inherit;
        font-weight: bold;
        cursor: pointer;
        font-size: 1rem;
        transition: all 0.3s ease;
    `;

    adventureBtn.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.1)';
    });

    adventureBtn.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1)';
    });

    adventureBtn.addEventListener('click', function () {
        const locationIds = Object.keys(locationsData);
        const randomLocation = locationIds[Math.floor(Math.random() * locationIds.length)];
        showLocationInfo(randomLocation);

        // تأثير ممتع
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> مغامرة!';
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-dice"></i> مغامرة عشوائية';
        }, 1000);
    });

    header.appendChild(adventureBtn);

    // إضافة أنماط للزر
    const style = document.createElement('style');
    style.textContent = `
        .adventure-btn:hover {
            background: linear-gradient(45deg, #7209b7, #ff006e) !important;
            box-shadow: 0 5px 15px rgba(255, 0, 110, 0.4) !important;
        }
        
        .fun-btn {
            padding: 10px 20px;
            border: none;
            border-radius: 10px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            font-family: inherit;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .fun-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 10px rgba(0,0,0,0.2);
        }
    `;
    document.head.appendChild(style);
});
// تسجيل Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
// ===== تهيئة التطبيق =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 بدء تحميل خريطة أرض أوو...');
    
    // تهيئة أنظمة جديدة
    AchievementSystem.init();
    
    // أنظمة قابلة للتهيئة
    let interactiveMap = null;
    let treasureHunt = null;
    let musicPlayer = null;
    let profileSystem = null;
    
    // تهيئة بعد تحميل الصفحة
    setTimeout(() => {
        interactiveMap = new InteractiveMap();
        treasureHunt = new TreasureHunt();
        musicPlayer = new MusicPlayer();
        profileSystem = new ProfileSystem();
        
        console.log('✅ جميع الأنظمة جاهزة!');
    }, 1000);
    
    // زر المشاركة
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: 'خريطة أرض أوو التفاعلية',
                    text: 'استكشف عالم Adventure Time بخريطة تفاعلية رائعة!',
                    url: window.location.href
                });
            } else {
                // نسخ الرابط
                navigator.clipboard.writeText(window.location.href)
                    .then(() => {
                        alert('✅ تم نسخ الرابط! شاركه مع أصدقائك.');
                    });
            }
        });
    }
    
    // زر الإحصائيات
    const statsBtn = document.querySelector('.stats-btn');
    if (statsBtn) {
        statsBtn.addEventListener('click', showStatistics);
    }
    
    // دالة لعرض الإحصائيات
    function showStatistics() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        modal.innerHTML = `
            <div class="modal-content">
                <h2 style="text-align: center; color: #7209b7;">📊 إحصائيات المغامرة</h2>
                
                <div style="
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    margin: 30px 0;
                ">
                    <div style="
                        background: linear-gradient(45deg, #ffafcc, #ffd166);
                        padding: 20px;
                        border-radius: 15px;
                        text-align: center;
                        color: #333;
                    ">
                        <div style="font-size: 2.5rem; font-weight: bold;">${AchievementSystem.points}</div>
                        <div>النقاط الإجمالية</div>
                    </div>
                    
                    <div style="
                        background: linear-gradient(45deg, #a2d2ff, #cdb4db);
                        padding: 20px;
                        border-radius: 15px;
                        text-align: center;
                        color: #333;
                    ">
                        <div style="font-size: 2.5rem; font-weight: bold;">
                            ${Object.values(AchievementSystem.achievements).filter(a => a.unlocked).length}
                        </div>
                        <div>الإنجازات</div>
                    </div>
                    
                    <div style="
                        background: linear-gradient(45deg, #06d6a0, #118ab2);
                        padding: 20px;
                        border-radius: 15px;
                        text-align: center;
                        color: white;
                    ">
                        <div style="font-size: 2.5rem; font-weight: bold;">
                            ${AchievementSystem.visitedLocations.size}
                        </div>
                        <div>المواقع التي زرتها</div>
                    </div>
                    
                    <div style="
                        background: linear-gradient(45deg, #ef476f, #ff006e);
                        padding: 20px;
                        border-radius: 15px;
                        text-align: center;
                        color: white;
                    ">
                        <div style="font-size: 2.5rem; font-weight: bold;">
                            ${treasureHunt ? treasureHunt.foundTreasures.size : 0}/3
                        </div>
                        <div>الكنوز التي وجدتها</div>
                    </div>
                </div>
                
                <div style="margin-top: 30px;">
                    <h3>🎯 الإنجازات</h3>
                    <div style="
                        max-height: 200px;
                        overflow-y: auto;
                        margin-top: 15px;
                    ">
                        ${Object.entries(AchievementSystem.achievements).map(([key, achievement]) => `
                            <div style="
                                display: flex;
                                align-items: center;
                                gap: 15px;
                                padding: 10px;
                                background: ${achievement.unlocked ? '#e8f5e9' : '#f5f5f5'};
                                margin-bottom: 10px;
                                border-radius: 10px;
                                border-left: 5px solid ${achievement.unlocked ? '#4caf50' : '#ccc'};
                            ">
                                <span style="font-size: 1.5rem;">${achievement.icon}</span>
                                <div>
                                    <div style="font-weight: bold;">${achievement.name}</div>
                                    <small style="color: #666;">${achievement.description}</small>
                                </div>
                                <div style="margin-left: auto;">
                                    ${achievement.unlocked ? 
                                        `<span style="color: #4caf50; font-weight: bold;">+${achievement.points}</span>` : 
                                        `<span style="color: #999;">${achievement.points} نقطة</span>`
                                    }
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <button class="close-modal" style="
                    width: 100%;
                    padding: 15px;
                    background: #7209b7;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 20px;
                ">
                    إغلاق
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
    }
});
// نظام عداد الزوار (التخزين المحلي)
class VisitorCounter {
    constructor() {
        this.countElement = document.getElementById('visitor-count');
        this.totalVisits = 0;
        this.uniqueVisitors = 0;
        this.init();
    }
    
    init() {
        this.loadCounters();
        this.updateCounter();
        this.setupRealTimeEffects();
    }
    
    loadCounters() {
        // الزيارات الإجمالية
        this.totalVisits = parseInt(localStorage.getItem('ooo_total_visits')) || 0;
        
        // الزوار الفريدين (باستخدام cookies أو localStorage)
        this.uniqueVisitors = parseInt(localStorage.getItem('ooo_unique_visitors')) || 0;
        
        // زيادة العدادات
        this.incrementCounters();
    }
    
    incrementCounters() {
        // زيادة الزيارات الإجمالية
        this.totalVisits++;
        localStorage.setItem('ooo_total_visits', this.totalVisits);
        
        // التحقق من الزائر الجديد (باستخدام sessionStorage)
        if (!sessionStorage.getItem('ooo_has_visited')) {
            this.uniqueVisitors++;
            localStorage.setItem('ooo_unique_visitors', this.uniqueVisitors);
            sessionStorage.setItem('ooo_has_visited', 'true');
            
            // عرض ترحيب خاص للزائر الجديد
            this.showWelcomeMessage();
        }
    }
    
    updateCounter() {
        if (this.countElement) {
            // عرض عدد الزوار الفريدين مع تأثيرات
            this.countElement.textContent = this.uniqueVisitors.toLocaleString();
            
            // تحديث العنوان ليشمل العدد
            document.title = `خريطة أرض أوو (${this.uniqueVisitors} مغامر)`;
        }
    }
    
    showWelcomeMessage() {
        // عرض رسالة ترحيب للزائر الجديد بعد 3 ثواني
        setTimeout(() => {
            const messages = [
                "🎉 مرحباً بك أيها المغامر الجديد!",
                "🌟 انضم إلى مجتمع مستكشفي أوو!",
                "🚀 أنت المغامر رقم " + this.uniqueVisitors + "!",
                "🌈 استمتع باكتشاف عالم Adventure Time!"
            ];
            
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            this.showFloatingMessage(randomMessage);
        }, 3000);
    }
    
    showFloatingMessage(message) {
        const messageEl = document.createElement('div');
        messageEl.className = 'floating-message';
        messageEl.innerHTML = `
            <div style="
                position: fixed;
                top: 100px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(45deg, #ff006e, #7209b7);
                color: white;
                padding: 15px 30px;
                border-radius: 25px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.3);
                z-index: 10000;
                animation: floatIn 0.5s ease, floatOut 0.5s ease 4.5s forwards;
                text-align: center;
                max-width: 90%;
                border: 3px solid #ffd166;
            ">
                <i class="fas fa-sparkles" style="margin-right: 10px;"></i>
                ${message}
                <i class="fas fa-sparkles" style="margin-left: 10px;"></i>
            </div>
        `;
        
        document.body.appendChild(messageEl);
        
        // إزالة الرسالة بعد 5 ثواني
        setTimeout(() => {
            messageEl.remove();
        }, 5000);
    }
    
    setupRealTimeEffects() {
        // تأثير زيادة العدد تدريجياً
        let currentDisplay = 0;
        const target = this.uniqueVisitors;
        const increment = target / 50; // 50 خطوة
        
        const animateCount = () => {
            if (currentDisplay < target) {
                currentDisplay += increment;
                if (currentDisplay > target) currentDisplay = target;
                this.countElement.textContent = Math.floor(currentDisplay).toLocaleString();
                requestAnimationFrame(animateCount);
            }
        };
        
        animateCount();
        
        // تحديث عشوائي (لمحاكاة دخول زوار جدد)
        this.setupRandomUpdates();
    }
    
    setupRandomUpdates() {
        // تحديث عشوائي كل 30-120 ثانية لمحاكاة دخول زوار جدد
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% فرصة لتحديث
                const increase = Math.floor(Math.random() * 3) + 1;
                this.uniqueVisitors += increase;
                localStorage.setItem('ooo_unique_visitors', this.uniqueVisitors);
                
                // تأثير بسيط للزيادة
                this.animateIncrease(increase);
            }
        }, 30000 + Math.random() * 90000); // بين 30 و 120 ثانية
    }
    
    animateIncrease(increase) {
        const counter = this.countElement;
        counter.style.transform = 'scale(1.2)';
        counter.style.color = '#ff006e';
        
        // عرض رسالة الزيادة الصغيرة
        const increaseEl = document.createElement('div');
        increaseEl.className = 'increase-message';
        increaseEl.textContent = `+${increase}`;
        increaseEl.style.cssText = `
            position: absolute;
            top: -20px;
            right: -10px;
            background: #4caf50;
            color: white;
            padding: 3px 8px;
            border-radius: 10px;
            font-size: 0.8rem;
            font-weight: bold;
            animation: floatUp 1s ease forwards;
        `;
        
        counter.parentElement.style.position = 'relative';
        counter.parentElement.appendChild(increaseEl);
        
        setTimeout(() => {
            counter.style.transform = 'scale(1)';
            counter.style.color = '#ffd166';
            counter.textContent = this.uniqueVisitors.toLocaleString();
            
            // إزالة رسالة الزيادة
            setTimeout(() => increaseEl.remove(), 1000);
        }, 500);
    }
}

// إضافة الأنماط للرسائل المتحركة
const visitorStyles = document.createElement('style');
visitorStyles.textContent = `
    @keyframes floatIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes floatOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    
    @keyframes floatUp {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-30px);
        }
    }
`;
document.head.appendChild(visitorStyles);