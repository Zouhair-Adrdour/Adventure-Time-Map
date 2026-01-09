// بيانات المواقع (يمكن توسيعها لاحقاً)
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
    point.addEventListener('click', function() {
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
    card.addEventListener('click', function() {
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
closeBtn.addEventListener('click', function() {
    locationInfo.classList.remove('active');
    defaultMessage.style.display = 'block';
    infoPanel.style.transform = 'scale(0.95)';
    setTimeout(() => {
        infoPanel.style.transform = 'scale(1)';
    }, 300);
});

// رسالة ترحيبية عند التحميل
window.addEventListener('load', function() {
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
    point.addEventListener('mouseenter', function() {
        const pointCircle = this.querySelector('.point');
        pointCircle.style.boxShadow = '0 0 15px rgba(0,0,0,0.3)';
    });
    
    point.addEventListener('mouseleave', function() {
        const pointCircle = this.querySelector('.point');
        pointCircle.style.boxShadow = 'none';
    });
});

// أزرار إضافية
document.addEventListener('DOMContentLoaded', function() {
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
    
    adventureBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    adventureBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    adventureBtn.addEventListener('click', function() {
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