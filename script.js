    // Oyun canvası
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    // Para birimi değişkeni
    let currency = 0;

    // Frame değişkeni
    let frame = 0;
    let currentFrame = 0;

    // Drone değişkenleri
    const droneImage = new Image();
    droneImage.src = 'drone.png';
    const droneMissileImage = new Image();
    droneMissileImage.src = 'missile.png';
    let showDrone = false;

    // Skin ve efekt seçimleri için global değişkenler
    let currentSkinIndex = 0;
    let currentEffectIndex = 0;
    let availableSkins = ['default']; // Varsayılan skin
    let availableEffects = ['default']; // Varsayılan efekt

    // Satın alınmış itemleri ve sahip olunan itemler için diziler
    let purchasedItems = {
        skins: [],
        effects: []
    };
    let equippedItems = {
    skin: null,
    effect: null
    };

    if(localStorage.getItem('equippedItems')) {
        equippedItems = JSON.parse(localStorage.getItem('equippedItems'));
    }

        // Oyun değişkenleri
        let player = { x: 400, y: 500, width: 50, height: 50, health: 100 };
        let enemies = [];
        let bullets = [];
        let bombs = [];
        let particles = [];
        let chargeParticles = [];
        let health = 100;
        let score = 0;
        let level = 1;
        let canDash = true;
        let canUseShield = true;
        let canUseUltimate = true;
        let isShieldActive = false;
        let dashCooldown = 100; // 0.1 saniye
        let shieldCooldown = 5000; // 5 saniye
        let ultimateCooldown = 10000; // 15 saniye
        let dashSound = new Audio('dash.mp3');
        let shieldSound = new Audio('shield.mp3');
        let ultimateSound = new Audio('ultimate.mp3');
        let shootingMode = 'auto';
        let colorIndex = 0;
        let gameStarted = false;
        let chargingBlackHole = false;
        let blackHoleChargeTime = 0;
        let maxChargeTime = 2500; // 2.5 saniye
        let chargingFusion = false;
        let fusionChargeStartTime = 0;
        let soundVolume = 0.5;
        let currentCategory = 1;

        const maxFusionChargeTime = 1000; // 1 saniye
        const baseFusionDamage = 100;
        const baseFusionRadius = 90;

        // Oyuncu görünümleri için resimleri yükle
const playerSkins = {
    angelskin: 'angelskin.png',
    demonskin: 'demonskin.png',
    neonskin: 'neonskin.png',
    colaskin: 'colaskin.png',
    funnyskin: 'funnyskin.png',
    sigmaskin: 'sigmaskin.png', 
    ascapedskin: 'ascapedskin.png',
    yeezusskin: 'yeezusskin.png'
};

        // Kan partikül efektleri için görüntüleri yükle
const bloodEffects = {
    angelpop: 'angelpop.png',
    demonpop: 'demonpop.png',
    neonpop: 'neonpop.png',
    colapop: 'colapop.png'
};

        // Oyun değişkenleri kısmının altına ekle (yaklaşık line 20)
let gameStats = {
    totalCurrency: 0,
    totalKills: 0,
    totalGames: 0,
    highScore: 0,
    playTime: 0,
    totalDamageDealt: 0,
    ultimatesUsed: 0,
    dashesUsed: 0
};

// Oyun seçenekleri
let gameOptions = {
    gore: true,
    minimap: true,
    cooldown: true,
    fireMode: true
};

// Toggle durumlarını başlangıçta ayarla
document.getElementById('toggleGore').checked = gameOptions.gore;
document.getElementById('toggleMinimap').checked = gameOptions.minimap;
document.getElementById('toggleCooldown').checked = gameOptions.cooldown;
document.getElementById('toggleFireMode').checked = gameOptions.fireMode;

// Toggle event listeners
document.getElementById('toggleGore').addEventListener('change', function(e) {
    gameOptions.gore = e.target.checked;
    localStorage.setItem('gameOptions', JSON.stringify(gameOptions));
});

document.getElementById('toggleMinimap').addEventListener('change', function(e) {
    gameOptions.minimap = e.target.checked;
    document.querySelector('.minimap-container').style.display = e.target.checked ? 'block' : 'none';
    localStorage.setItem('gameOptions', JSON.stringify(gameOptions));
});

document.getElementById('toggleCooldown').addEventListener('change', function(e) {
    gameOptions.cooldown = e.target.checked;
    document.querySelector('.cooldown-container').style.display = e.target.checked ? 'block' : 'none';
    localStorage.setItem('gameOptions', JSON.stringify(gameOptions));
});

document.getElementById('toggleFireMode').addEventListener('change', function(e) {
    gameOptions.fireMode = e.target.checked;
    document.getElementById('fireMode').style.display = e.target.checked ? 'block' : 'none';
    localStorage.setItem('gameOptions', JSON.stringify(gameOptions));
});

// LocalStorage'dan seçenekleri yükle
if(localStorage.getItem('gameOptions')) {
    gameOptions = JSON.parse(localStorage.getItem('gameOptions'));
}

// Sayfa yüklendiğinde localStorage'dan verileri yükle
window.addEventListener('load', () => {
    const savedStats = localStorage.getItem('gameStats');
    if (savedStats) {
        gameStats = JSON.parse(savedStats);
        updateStatsDisplay();
    }
});

// Oyun başlangıcında stats'ı yükle
if(localStorage.getItem('gameStats')) {
    gameStats = JSON.parse(localStorage.getItem('gameStats'));
}

        // Müzikler
        const backgroundMusic = new Audio('background.mp3');
        const background2Music = new Audio('background2.mp3');
        const background3Music = new Audio('background3.mp3');
        const background4Music = new Audio('background4.mp3');
        const background5Music = new Audio('background5.mp3');
        const background6Music = new Audio('background6.mp3');
        const background7Music = new Audio('background7.mp3');
        const background8Music = new Audio('background8.mp3');
        const background9Music = new Audio('background9.mp3');
        const background10Music = new Audio('background10.mp3');

        // Kategori 1 Ses efektleri
        const shootSound = new Audio('shoot.mp3');
        const laserSound = new Audio('laser.mp3');
        const beamSound = new Audio('beam.mp3');
        const tripleSound = new Audio('triple.mp3');
        const spreadSound = new Audio('spread.mp3');
        const lightningSound = new Audio('lightning.mp3');
        const plasmaBallSound = new Audio('plasmaball.mp3');
        const blackHoleSound = new Audio('blackhole.mp3');
        const punchSound = new Audio('punch.mp3');

        // Kategori 2 Ses efektleri
        const energySound = new Audio('energy.mp3');
        const lifestealerSound = new Audio('lifestealer.mp3');
        const flamethrowerSound = new Audio('flamethrower.mp3');
        const acidSpraySound = new Audio('acid.mp3');
        const droneMissileSound = new Audio('drone.mp3');
        const mutationRaySound = new Audio('mutation.mp3');
        const fusionSound = new Audio('fusion.mp3');
        const laserBeamSound = new Audio('laserbeam.mp3');
        const expRoundsSound = new Audio('exprounds.mp3');
        const punchHitSound = new Audio('punch_hit.mp3');

        // Görsel efektler ses efektleri
        const explosionSound = new Audio('explosion.mp3');
        const healingSound = new Audio('healing.mp3');
        const levelupSound = new Audio('levelup.mp3');

        // Geri kalan ses efektleri
        const buttonHoverSound = new Audio('button_hover.mp3');
        const buttonClickSound = new Audio('button_click.mp3');
        const deathSound = new Audio('death.mp3');
        const death2Sound = new Audio('death2.mp3');
        const death3Sound = new Audio('death3.mp3');
        const coinSound = new Audio('coin.mp3');

        // Kan partikül efektleri ses efektleri
        const angelpopSound = new Audio('angelpop.mp3');
        const demonpopSound = new Audio('demonpop.mp3');
        const colapopSound = new Audio('colapop.mp3');
        const neonpopSound = new Audio('neonpop.mp3');

        // Öylesine değişkenler
        const totalCategories = 3;
        const rainbowColors = ['#ff0000', '#ff5a00', '#f6ff00', '#02ff00', '#0005ff', '#ff00d8', '#7900ff'];
        
        // Tüm ses efektlerini bir diziye ekleme
        const soundEffects = [
            // Kategori 1 ses efektleri
            shootSound,
            laserSound, 
            beamSound,
            tripleSound,
            spreadSound,
            lightningSound,
            plasmaBallSound,
            blackHoleSound,
            punchSound,
            
            // Kategori 2 ses efektleri
            energySound,
            lifestealerSound,
            flamethrowerSound,
            acidSpraySound,
            droneMissileSound,
            mutationRaySound,
            fusionSound,
            laserBeamSound,
            
            // Oyuncu ses efektleri
            dashSound,
            shieldSound,
            ultimateSound,
            
            // Çarpışma/Efekt sesleri
            punchHitSound,
            explosionSound,
            healingSound,
            
            // Düşman ölüm sesleri
            deathSound,
            death2Sound,
            death3Sound,
            
            // UI sesleri
            buttonHoverSound,
            buttonClickSound,
            levelupSound,
            coinSound,
        ];

        // Kategori 1 Ateş aralıkları
        let laserInterval = null;
        let autoFireInterval = null;
        let beamInterval = null;
        let tripleFireInterval = null;
        let bombInterval = null;
        let spreadInterval = null;
        let lightningInterval = null;
        let plasmaBallInterval = null;
        let blackHoleInterval = null;
        let punchInterval = null;

        // Kategori 2 Ateş aralıkları
        let energyInterval = null;
        let lifestealerInterval = null;
        let flamethrowerInterval = null;
        let acidSprayInterval = null;
        let droneMissileInterval = null;
        let mutationRayInterval = null;
        let laserBeamInterval = null;
        let expRoundsInterval = null;

        // Kategori 3 Ateş aralıkları
        let minigunInterval = null;

        // Sayfa yüklendiğinde startScreen'i gizle
document.getElementById("startScreen").style.display = "none";

// Oyun başlatma fonksiyonunu güncelle
window.addEventListener('load', function() {
    // warningScreen varsayılan olarak görünür olacak
    document.getElementById("warningScreen").style.display = "flex";
    
    // ENTER tuşuna basılmasını dinle
    document.addEventListener("keydown", function(event) {
        if (event.code === "Enter") {
            const warningScreen = document.getElementById("warningScreen");
            if (warningScreen.style.display !== "none") {
                // Fade-out animasyonunu ekle
                warningScreen.classList.add('fade-out');
                
                // Animasyon bittikten sonra ekranı gizle ve startScreen'i göster
                setTimeout(() => {
                    warningScreen.style.display = "none";
                    document.getElementById("startScreen").style.display = "block";
                }, 1000);
            }
        }
    });
});

        // Oyun başlatma fonksiyonu
        function startGame() {
            document.getElementById("startScreen").style.display = "none";
            gameStarted = true;
            backgroundMusic.loop = true;
            
            // Slider değerlerini güvenli şekilde al
            let musicValue = 0.5;
            let soundValue = 0.5;
            
            const musicSlider = document.getElementById('musicVolume');
            const soundSlider = document.getElementById('soundVolume');
            
            if (musicSlider) {
                musicValue = musicSlider.value / 100;
            }
            if (soundSlider) {
                soundValue = soundSlider.value / 100;
            }
            
            backgroundMusic.volume = musicValue;
            soundVolume = soundValue;
            soundEffects.forEach(sound => {
                sound.volume = soundValue;
            });
            
            backgroundMusic.play();
            updateStatsDisplay();

            gameLoop();
        }

        function returnToMenu() {
            // Ekranları kapat
            document.getElementById("defeatScreen").style.display = "none";
            document.getElementById("victoryScreen").style.display = "none";
            
            // Oyunu sıfırla
            player = { x: 400, y: 500, width: 50, height: 50, health: 100 };
            enemies = [];
            bullets = [];
            bombs = [];
            health = 100;
            score = 0;
            level = 1;
            
            // Ana menüyü göster
            document.getElementById("startScreen").style.display = "block";
            
            // Oyun durumunu güncelle
            gameStarted = false;
        }
        
        // Stats gösterim fonksiyonu
function updateStatsDisplay() {
    const statsHtml = `
        <div class="stats-panel">
            <div class="stat-item">En Yüksek Skor: ${gameStats.highScore}</div>
            <div class="stat-item">Toplam Öldürme: ${gameStats.totalKills}</div>
            <div class="stat-item">Toplam Oyun: ${gameStats.totalGames}</div>
            <div class="stat-item">Toplam Hasar: ${Math.floor(gameStats.totalDamageDealt)}</div>
            <div class="stat-item">Ultimate Kullanımı: ${gameStats.ultimatesUsed}</div>
            <div class="stat-item">Dash Kullanımı: ${gameStats.dashesUsed}</div>
        </div>
    `;
    
    // Stats panelini game-menu içine ekle
    document.querySelector('.menu-content').insertAdjacentHTML('beforeend', statsHtml);
}

        function dash() {
        if (!canDash || !gameStarted) return;
        updateStats('dash');
    
    const dashDistance = 150;
    let dashDirection = {x: 0, y: 0};
    
    // Yön belirleme - tuş kontrollerinden
    if (keyState['KeyW']) dashDirection.y = -1;
    if (keyState['KeyS']) dashDirection.y = 1;
    if (keyState['KeyA']) dashDirection.x = -1;
    if (keyState['KeyD']) dashDirection.x = 1;
    
    // Dash yönü belirlenmemişse ileri dash at
    if (dashDirection.x === 0 && dashDirection.y === 0) {
        dashDirection.y = -1;
    }

    // Dash öncesi pozisyon
    const startX = player.x;
    const startY = player.y;
    
    // Dash hareketi
    player.x += dashDirection.x * dashDistance;
    player.y += dashDirection.y * dashDistance;
    
    // Sınırları kontrol et
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));

    // Dash sesi
    dashSound.currentTime = 0;
    dashSound.volume = soundVolume;
    dashSound.play();

    // Dash efekti - Koni şeklinde
    const coneAngle = Math.PI / 3; // 60 derece
    const coneLength = dashDistance;
    
    // Yarı saydam beyaz koni efekti
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(startX + player.width/2, startY + player.height/2);
    ctx.arc(startX + player.width/2, startY + player.height/2, 
            coneLength,
            Math.atan2(dashDirection.y, dashDirection.x) - coneAngle/2,
            Math.atan2(dashDirection.y, dashDirection.x) + coneAngle/2);
    ctx.lineTo(startX + player.width/2, startY + player.height/2);
    ctx.fill();
    ctx.restore();

    // Mavi daire yumruk efekti
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: startX + player.width/2 + (dashDirection.x * dashDistance * i/10),
            y: startY + player.height/2 + (dashDirection.y * dashDistance * i/10),
            dx: dashDirection.x * 2,
            dy: dashDirection.y * 2,
            size: 20,
            life: 15,
            color: 'rgba(68, 68, 255, 0.6)'
        });
    }
            
            // Dash hasarı - Koni içindeki düşmanlara
            enemies.forEach((enemy, index) => {
                // Düşmanın merkez noktası
                const enemyCenterX = enemy.x + enemy.width/2;
                const enemyCenterY = enemy.y + enemy.height/2;
                
                // Düşmanın dash yolunda olup olmadığını kontrol et
                const angle = Math.atan2(enemyCenterY - startY, enemyCenterX - startX);
                const dashAngle = Math.atan2(dashDirection.y, dashDirection.x);
                const angleDiff = Math.abs(angle - dashAngle);
                
                // Mesafe kontrolü
                const distance = Math.hypot(enemyCenterX - startX, enemyCenterY - startY);
                
                // Eğer düşman koni içindeyse ve mesafe uygunsa hasar ver
                if (distance < coneLength && angleDiff < coneAngle/2) {
                    enemy.health -= 150;
                    if (enemy.health <= 0) {
                        enemies.splice(index, 1);
                        updateScore(500);
                    }
                }
            });
            
            // Cooldown
            canDash = false;
            setTimeout(() => {
                canDash = true;
            }, dashCooldown);
        }

        function activateShield() {
            if (!canUseShield || !gameStarted) return;
            
            isShieldActive = true;
            shieldSound.currentTime = 0;
            shieldSound.volume = soundVolume;
            shieldSound.play();
            
            // Shield efekti
            createShieldEffect();
            
            // 3 saniye sonra kalkanı kapat
            setTimeout(() => {
                isShieldActive = false;
            }, 3000);
            
            // Cooldown
            canUseShield = false;
            setTimeout(() => {
                canUseShield = true;
            }, shieldCooldown);
        }

        function activateUltimate() {
            if (!canUseUltimate || !gameStarted) return;
            updateStats('ultimate');

            // Ultimate efekti
            ultimateSound.currentTime = 0;
            ultimateSound.volume = soundVolume;
            ultimateSound.play();
            
            // Tüm düşmanlara hasar ver
            enemies.forEach((enemy, index) => {
                enemy.health -= 400;
                if (enemy.health <= 0) {
                    enemies.splice(index, 1);
                    updateScore(500);
                }
            });
            
            // Ekrana efekt
            createUltimateEffect();
            
            // Cooldown
            canUseUltimate = false;
            setTimeout(() => {
                canUseUltimate = true;
            }, ultimateCooldown);
        }

        // Efekt fonksiyonları
function createShieldEffect() {
    const shieldRadius = 40;
    for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        particles.push({
            x: player.x + player.width/2 + Math.cos(angle) * shieldRadius,
            y: player.y + player.height/2 + Math.sin(angle) * shieldRadius,
            dx: 0,
            dy: 0,
            life: 180,
            size: 4,
            color: '#44ffff'
        });
    }
}

function createUltimateEffect() {
    for (let i = 0; i < 100; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        particles.push({
            x: player.x + player.width/2,
            y: player.y + player.height/2,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            life: 60,
            size: 3,
            color: '#ff4444'
        });
    }
}

        // Düşman oluşturma fonksiyonları
        function createEnemy() {
            let enemyType = Math.random();
            let enemy;

            if (enemyType < 0.45) { // 45% normal düşman
                enemy = { x: Math.random() * (canvas.width - 50), y: 0, width: 50, height: 50, health: 50, color: 'red', type: 'normal' };
            } else if (enemyType < 0.69) { // 20% tank düşman
                enemy = { x: Math.random() * (canvas.width - 50), y: 0, width: 50, height: 50, health: 100, color: 'purple', type: 'tank' };
            } else if (enemyType < 0.79) { // 10% hızlı düşman
                enemy = { x: Math.random() * (canvas.width - 60), y: 0, width: 60, height: 30, health: 200, color: 'lime', type: 'fast' };
            } else if (enemyType < 0.89) { // 10% beyaz düşman
                enemy = { x: Math.random() * (canvas.width - 50), y: 0, width: 50, height: 50, health: 400, color: '#FFFFFF', type: 'white' };
            } else if (enemyType < 0.99) { // 10% sigma düşman
                let sigmaImage = new Image();
                sigmaImage.src = 'sigma.png';
                enemy = { x: Math.random() * (canvas.width - 40), y: 0, width: 50, height: 50, health: 150, color: '#61618a', image: sigmaImage, type: 'sigma' };
            } else { // 5% sarı düşman 
                enemy = { x: Math.random() * (canvas.width - 80), y: 0, width: 80, height: 80, health: 700, color: 'yellow', type: 'giant' };
            }
            enemies.push(enemy);
        }

        // Ayarlar kısmı
        function toggleSettings() {
    const settingsScreen = document.getElementById('settingsScreen');
    const isVisible = settingsScreen.style.display === 'flex';
    settingsScreen.style.display = isVisible ? 'none' : 'flex';
    buttonClickSound.currentTime = 0;
                buttonClickSound.volume = soundVolume;
                buttonClickSound.play();
}

        function changeTheme() {
    const theme = document.getElementById('themeSelect').value;
    document.body.className = theme;
        }

        function changeMusic() {
    const music = document.getElementById('musicSelect').value;
    backgroundMusic.src = music;
    backgroundMusic.play();
        }

        function closeSettings() {
    document.getElementById('settingsScreen').style.display = 'none';
        }

        function drawPlayer() {
            if (currentSkin && currentSkin !== 'default') {
                // Skin çizimi
                const skinImage = new Image();
                skinImage.src = playerSkins[currentSkin];
                
                if (!skinImage.complete) {
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(player.x, player.y, player.width, player.height);
                    
                    skinImage.onload = () => {
                        ctx.drawImage(skinImage, player.x, player.y, player.width, player.height);
                    };
                } else {
                    ctx.drawImage(skinImage, player.x, player.y, player.width, player.height);
                }
            } else {
                // Varsayılan görünüm
                ctx.fillStyle = 'blue';
                ctx.fillRect(player.x, player.y, player.width, player.height);
            }
        }

        // Oyun güncelleme fonksiyonları
        function updateHealth() {
            document.getElementById("health").innerHTML = `
                <i data-lucide="heart"></i>
                <span>Sağlık: ${health}</span>
            `;
            lucide.createIcons();
        }
        
        function updateScore(points) {
            score += points;
            document.getElementById("score").innerHTML = `
                <i data-lucide="trophy"></i>
                <span>Puan: ${score}</span>
            `;
            lucide.createIcons();
        }

        function updateLevel() {
            let newLevel = Math.floor(score / 5000) + 1;
            // Seviye atlama kontrolü
            if (newLevel > level) {
                levelupSound.currentTime = 0;
                levelupSound.play();
                showLevelUpText();
            }
            level = newLevel;
            document.getElementById("level").innerHTML = `
                <i data-lucide="zap"></i>
                <span>Seviye: ${level}</span>
            `;
            lucide.createIcons();
        }

        function toggleShop() {
            const shopScreen = document.getElementById("shopScreen");
            if(shopScreen.style.display === "none") {
                shopScreen.style.display = "block";
                updateShopContent();    
                buttonClickSound.currentTime = 0;
                buttonClickSound.volume = soundVolume;
                buttonClickSound.play();
            } else {
                shopScreen.style.display = "none";
            }
        }

        function updateShopContent() {
            const shopItems = document.getElementById("shopItems");
            shopItems.innerHTML = `
                <div class="shop-category">
                    <h3>Oyuncu Skinleri</h3>
                    <div class="shop-grid">
                        ${createShopItem('angelskin', 'Melek Skin', 1500, purchasedItems.skins.includes('angelskin'))}
                        ${createShopItem('demonskin', 'Şeytan Skin', 2000, purchasedItems.skins.includes('demonskin'))}
                        ${createShopItem('neonskin', 'Neon Skin', 3000, purchasedItems.skins.includes('neonskin'))}
                        ${createShopItem('colaskin', 'Kola Skin', 6000, purchasedItems.skins.includes('colaskin'))}
                        ${createShopItem('funnyskin', 'Komik Skin', 3000, purchasedItems.skins.includes('funnyskin'))}
                        ${createShopItem('sigmaskin', 'Sigma Skin', 4000, purchasedItems.skins.includes('sigmaskin'))}
                        ${createShopItem('ascapedskin', 'Ascaped Skin', 3000, purchasedItems.skins.includes('ascapedskin'))}
                        ${createShopItem('yeezusskin', 'Yeezus Skin', 5000, purchasedItems.skins.includes('yeezusskin'))}
                    </div>
                </div>
                <div class="shop-category">
                    <h3>Kan Efektleri</h3>
                    <div class="shop-grid">
                        ${createShopItem('angelpop', 'Melek Efekti', 2000, purchasedItems.effects.includes('angelpop'))}
                        ${createShopItem('demonpop', 'Şeytan Efekti', 3000, purchasedItems.effects.includes('demonpop'))}
                        ${createShopItem('neonpop', 'Neon Efekti', 5000, purchasedItems.effects.includes('neonpop'))}
                        ${createShopItem('colapop', 'Kola Efekti', 3000, purchasedItems.effects.includes('colapop'))}
                    </div>
                </div>
            `;
        }
        
        function createShopItem(id, name, price, isPurchased) {
            return `
                <div class="shop-item ${isPurchased ? 'purchased' : ''}" 
                     onclick="${isPurchased ? '' : `purchaseItem('${id}')`}">
                    <img src="${id}.png" alt="${name}">
                    <div class="item-info">
                        <div class="item-name">${name}</div>
                        <div class="item-price">${isPurchased ? 'Satın Alındı' : price + '💲'}</div>
                    </div>
                </div>
            `;
        }
        
        // Dükkan dışına tıklanınca kapanma
        document.addEventListener('mousedown', function(event) {
            const shopScreen = document.getElementById('shopScreen');
            const shopContent = document.querySelector('.shop-content');
            
            if (event.target === shopScreen) {
                shopScreen.style.display = 'none';
            }
        });

        // Para göstergesini UI'a ekle
function updateCurrencyDisplay() {
    document.getElementById("currency").innerHTML = `
        <img src="coin.png" width="20" height="20" style="vertical-align: middle;">
        <span>${currency}</span>
    `;
}

// Satın alma fonksiyonu
function purchaseItem(itemId) {
    const items = {
        'angelskin': { price: 1500, type: 'skin' },
        'demonskin': { price: 2000, type: 'skin' },
        'neonskin': { price: 3000, type: 'skin' },
        'colaskin': { price: 6000, type: 'skin' }, 
        'funnyskin': { price: 3000, type: 'skin' },
        'sigmaskin': { price: 4000, type: 'skin' },
        'ascapedskin': { price: 3000, type: 'skin' },
        'yeezusskin': { price: 5000, type: 'skin' },
        'angelpop': { price: 2000, type: 'effect' },
        'demonpop': { price: 3000, type: 'effect' },
        'neonpop': { price: 5000, type: 'effect' },
        'colapop': { price: 3000, type: 'effect' }
    };

    const item = items[itemId];
    
    // İtem daha önce satın alınmış mı kontrol et
    if (item.type === 'skin' && purchasedItems.skins.includes(itemId)) {
        showNotification('Bu skini zaten satın aldınız.', 'error');
        return;
    }
    if (item.type === 'effect' && purchasedItems.effects.includes(itemId)) {
        showNotification('Bu efekti zaten satın aldınız.', 'error');
        return;
    }

    if (currency >= item.price) {
        currency -= item.price;
        
        // Satın alınan itemi listeye ekle
        if (item.type === 'skin') {
            purchasedItems.skins.push(itemId);
        } else {
            purchasedItems.effects.push(itemId);
        }
        
        // LocalStorage'a kaydet
        localStorage.setItem('purchasedItems', JSON.stringify(purchasedItems));
        
        updateCurrencyDisplay();
        updateShopContent(); // Dükkan görünümünü güncelle
        
        coinSound.currentTime = 0;
        coinSound.volume = soundVolume;
        coinSound.play();

        showNotification(`${itemId} başarıyla satın alındı!`);
    } else {
        showNotification('Yetersiz para!', 'error');
    }
}

// Satın alınan skinleri ve efektleri dizilere ekle
function updateAvailableItems() {
    // Dizileri sıfırla ve varsayılanları ekle
    availableSkins = ['default'];
    availableEffects = ['default'];
    
    // Satın alınan skinleri ekle
    if(purchasedItems.skins) {
        availableSkins = availableSkins.concat(purchasedItems.skins);
    }
    
    // Satın alınan efektleri ekle
    if(purchasedItems.effects) {
        availableEffects = availableEffects.concat(purchasedItems.effects);
    }
}

// LocalStorage'a kaydetme
function saveEquippedItems() {
    const equipped = {
        skin: currentSkin,
        effect: currentEffect
    };
    localStorage.setItem('equippedItems', JSON.stringify(equipped));
}

// LocalStorage'dan yükleme
window.addEventListener('load', () => {
    const savedEquipped = localStorage.getItem('equippedItems');
    if (savedEquipped) {
        const equipped = JSON.parse(savedEquipped);
        currentSkin = equipped.skin || 'default';
        currentEffect = equipped.effect || 'default';
    }
});

// Bildirim sistemi
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

        function showLevelUpText() {
            const text = "SEVİYE ATLANDI!";
            const levelUpElement = document.getElementById('levelUpText');
            levelUpElement.innerHTML = ''; 
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                // Boşluk karakteri için özel işlem
                if (char === ' ') {
                    span.innerHTML = '&nbsp;';
                } else {
                    span.textContent = char;
                }
                span.style.animationDelay = `${index * 0.1}s`;
                levelUpElement.appendChild(span);
            });
            
            levelUpElement.classList.add('show');
            
            setTimeout(() => {
                levelUpElement.classList.remove('show');
            }, 2000);
        }

        function showDroneText() {
            // Eğer zaten varsa eski yazıyı kaldır
            const existingText = document.querySelector('.drone-text');
            if (existingText) {
                existingText.remove();
            }
        
            // Yeni yazı elementini oluştur
            const droneText = document.createElement('div');
            droneText.textContent = 'Drone çıkartıldı.';
            droneText.className = 'drone-text';
            document.body.appendChild(droneText);
        
            // 1 saniye sonra kaldır
            setTimeout(() => {
                droneText.remove();
            }, 1000);
        }

// Tüm butonlara ses efekti ekle
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        buttonHoverSound.currentTime = 0;
        buttonHoverSound.volume = soundVolume;
        buttonHoverSound.play();
    });
    
    button.addEventListener('click', () => {
        buttonClickSound.currentTime = 0;
        buttonClickSound.volume = soundVolume;
        buttonClickSound.play();
    });
});
        // Butonlara ses efektleri ekle
document.querySelectorAll('.menu-button').forEach(button => {
    button.addEventListener('mouseenter', () => {
      buttonHoverSound.currentTime = 0;
      buttonHoverSound.volume = soundVolume;
      buttonHoverSound.play();
    });
    
    button.addEventListener('click', () => {
      buttonClickSound.currentTime = 0; 
      buttonClickSound.volume = soundVolume;
      buttonClickSound.play();
    });
  });
        // Ses kontrolü event listener'ları
document.getElementById('musicVolume').addEventListener('input', function(e) {
    const value = e.target.value / 100;
    backgroundMusic.volume = value;
    document.getElementById('musicValue').textContent = `${e.target.value}%`;
});

document.getElementById('soundVolume').addEventListener('input', function(e) {
    const value = e.target.value / 100;
    soundVolume = value;
    soundEffects.forEach(sound => {
        sound.volume = value;
    });
    document.getElementById('soundValue').textContent = `${e.target.value}%`;
});

        // Kategori 1 (Ateş modları)
        function shoot() {
            let bullet = { x: player.x + 20, y: player.y, speed: 5, type: 'normal' };
            bullets.push(bullet);
            shootSound.currentTime = 0;
            shootSound.play();
        }

        function shootLaser() {
            let bullet = { x: player.x + 20, y: player.y, speed: 10, type: 'laser' };
            bullets.push(bullet);
            laserSound.currentTime = 0;
            laserSound.play();
        }

        function throwBomb() {
            let bomb = { x: player.x + 20, y: player.y, speed: 6, isExploded: false };
            bombs.push(bomb);
        }

        function shootBeam() {
            let bullet = { x: player.x + 20, y: player.y, speed: 9, type: 'beam', color: rainbowColors[colorIndex] };
            bullets.push(bullet);
            beamSound.currentTime = 0;
            beamSound.play();
            colorIndex = (colorIndex + 1) % rainbowColors.length;
        }

        function shootTriple() {
            const leftBullet = { x: player.x + 15, y: player.y, speed: 8, direction: -0.9, type: 'triple' };
            const centerBullet = { x: player.x + 20, y: player.y, speed: 8, direction: 0, type: 'triple' };
            const rightBullet = { x: player.x + 25, y: player.y, speed: 8, direction: 0.9, type: 'triple' };
            bullets.push(leftBullet, centerBullet, rightBullet);
            tripleSound.currentTime = 0;
            tripleSound.play();
        }

        function shootSpread() {
            for (let i = -4; i <= 4; i++) {
                let bullet = { x: player.x + 20, y: player.y, speed: 8, direction: i, type: 'spread' };
                bullets.push(bullet);
            }
            spreadSound.currentTime = 0;
            spreadSound.play();
        }

        function shootLightning() {
            let bullet = { x: player.x + 20, y: player.y, speed: 12, type: 'lightning' };
            bullets.push(bullet);
            lightningSound.currentTime = 0;
            lightningSound.play();
        }

        function shootPlasmaBall() {
            let bullet = { x: player.x + 20, y: player.y, speed: 3, type: 'plasmaBall', radius: 15 };
            bullets.push(bullet);
            plasmaBallSound.currentTime = 0;
            plasmaBallSound.play();
        }

        function createBlackHole() {
            const bullet = {
                x: player.x + player.width/2,
                y: player.y,
                speed: 5,
                type: 'blackHole',
                damage: 20,
                radius: 1, // Başlangıçta küçük
                maxRadius: 25, // Maximum yarıçap
                lifespan: 2000, // ??? saniye
                alpha: 0, // Başlangıç saydamlığı
                rotation: 0 // Dönüş açısı
            };
            bullets.push(bullet);
            blackHoleSound.currentTime = 0;
            blackHoleSound.play();
        }

        function shootPunch() {
    let bullet = { 
    x: player.x + 20, y: player.y, speed: 8, type: 'punch', lifespan: 20
    };
    bullets.push(bullet);
    punchSound.currentTime = 0;
    punchSound.play();
}

    // Kategori 2 (Ateş modları)
    function shootEnergy() {
    let bullet = { x: player.x + 20, y: player.y, speed: 7, type: 'energy' };
    bullets.push(bullet);
    energySound.currentTime = 0;
    energySound.play();
}

function shootLifestealer() {
    let bullet = { x: player.x + 20, y: player.y, speed: 8, type: 'lifestealer' };
    bullets.push(bullet);
    lifestealerSound.currentTime = 0;
    lifestealerSound.play();
}

function shootFlamethrower() {
    const bullet = { 
        x: player.x + player.width/2,
        y: player.y,
        speed: 8,
        type: 'flamethrower',
        direction: (Math.random() - 0.5) * 2, // Rastgele yayılma
        life: 30 // Merminin ömrü
    };
    bullets.push(bullet);
    createFlameEffect(bullet.x, bullet.y);

    flamethrowerSound.currentTime = 0;
    flamethrowerSound.play();
}

function shootAcidSpray() {
    const bullet = {
        x: player.x + player.width/2,
        y: player.y,
        speed: 6,
        type: 'acidSpray',
        radius: 12,
        damage: 30,
        spreadAngle: (Math.random() - 0.5) * 1.2 // Rastgele yayılma
    };
    bullets.push(bullet);
    
    acidSpraySound.currentTime = 0;
    acidSpraySound.play();
}

function shootDroneMissile() {
    // En yakın düşmanı bul
    let nearestEnemy = null;
    let minDistance = Infinity;
    
    enemies.forEach(enemy => {
        const distance = Math.hypot(
            enemy.x - player.x,
            enemy.y - player.y
        );
        if (distance < minDistance) {
            minDistance = distance;
            nearestEnemy = enemy;
        }
    });

    const bullet = {
        x: player.x + player.width/2,
        y: player.y,
        speed: 3,
        type: 'droneMissile',
        damage: 200,
        splashRadius: 130, // Patlama yarıçapı
        target: nearestEnemy,
        turnSpeed: 0.1
    };
    bullets.push(bullet);
    droneMissileSound.currentTime = 0;
    droneMissileSound.volume = soundVolume;
    droneMissileSound.play();
}

// Mutasyon ışını atış fonksiyonu 
function shootMutationRay() {
    const bullet = {
        x: player.x + player.width/2,
        y: player.y,
        speed: 8,
        type: 'mutationRay',
        damage: 50,
        radius: 8,
        life: 60,
        mutations: []
    };
    bullets.push(bullet);
    mutationRaySound.currentTime = 0;
    mutationRaySound.volume = soundVolume;
    mutationRaySound.play();
}

function shootFusion() {
    const currentTime = Date.now();
    const chargeTime = Math.min(currentTime - fusionChargeStartTime, maxFusionChargeTime);
    const chargeRatio = chargeTime / maxFusionChargeTime;
    
    // Şarj süresine göre mermi özellikleri
    const bullet = {
        x: player.x + player.width/2,
        y: player.y,
        speed: 8,
        type: 'fusion',
        damage: baseFusionDamage + (baseFusionDamage * 5 * chargeRatio),
        radius: baseFusionRadius + (baseFusionRadius * 1 * chargeRatio),
        color: `hsl(${200 + chargeRatio * 160}, 100%, 50%)`
    };
    
    bullets.push(bullet);
    
    // Ses efekti
    fusionSound.currentTime = 0;
    fusionSound.volume = soundVolume;
    fusionSound.play();
}
// Lazer ışını atış fonksiyonu
function shootLaserBeam() {
    // Sol göz lazeri
    const leftBeam = {
        x: player.x + 15, // Sol göz pozisyonu
        y: player.y + 10,
        speed: 10,
        type: 'laserBeam',
        damage: 18,
        width: 3,
        length: 30,
        alpha: 1,
        core: '#ff0000',
        glow: 'rgba(255, 0, 0, 0.5)'
    };

    // Sağ göz lazeri
    const rightBeam = {
        x: player.x + player.width - 15, // Sağ göz pozisyonu
        y: player.y + 10,
        speed: 10,
        type: 'laserBeam',
        damage: 18,
        width: 3,
        length: 30,
        alpha: 1,
        core: '#ff0000',
        glow: 'rgba(255, 0, 0, 0.5)'
    };

    // İki lazer ışınını da ekle
    bullets.push(leftBeam, rightBeam);

    // Lazer sesi
    laserBeamSound.currentTime = 0;
    laserBeamSound.volume = soundVolume;
    laserBeamSound.play();

    // Göz parıltı efekti
    createEyeGlowEffect();
}
function shootExpRounds() {
    // 5 mermi çıkart, her biri farklı açıda
    for (let i = -6; i <= 6; i++) {
        const bullet = {
            x: player.x + player.width/2,
            y: player.y,
            speed: 9,
            type: 'expRounds',
            direction: i * 0.05, // Saçılma açısı
            radius: 100 // Patlama yarıçapı
        };
        bullets.push(bullet);
    }
    
    // Ses efekti
    expRoundsSound.currentTime = 0;
    expRoundsSound.volume = soundVolume;
    expRoundsSound.play();
}
// Minigun atış fonksiyonu
function shootMinigun() {
    let bullet = { 
        x: player.x + 20 + (Math.random() - 0.5) * 10, // Saçılma efekti için
        y: player.y, 
        speed: 8, 
        type: 'minigun',
        damage: 15
    };
    bullets.push(bullet);
    minigunSound.currentTime = 0;
    minigunSound.volume = soundVolume;
    minigunSound.play();
}
        // Mermi ve bomba güncelleme fonksiyonları
        function updateBullets() {
    bullets.forEach((bullet, index) => {
        switch (bullet.type) {
            case 'normal':
            case 'laser':
            case 'beam':
            case 'energy':
            case 'lifestealer':
                bullet.y -= bullet.speed;
                break;
            case 'triple':
            case 'spread':
                bullet.y -= bullet.speed;
                bullet.x += bullet.direction * 2;
                break;
            case 'lightning':
                bullet.y -= bullet.speed;
                bullet.x += Math.sin(bullet.y / 10) * 5;
                break;
            case 'plasmaBall':
                bullet.y -= bullet.speed;
                bullet.radius += 0.1;
                break;
                case 'blackHole':
                    // Kara delik sabit hızla yukarı hareket eder
                    bullet.y -= bullet.speed;
                    bullet.radius += 0.3;
    
    // Yakındaki düşmanları çek
    enemies.forEach(enemy => {
        const dx = (enemy.x + enemy.width/-10) - bullet.x;  // Tersine çevrildi
        const dy = (enemy.y + enemy.height/-10) - bullet.y;  // Tersine çevrildi
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < bullet.radius * 4) {
            const angle = Math.atan2(dy, dx);
            enemy.x += Math.cos(angle) * -10;  // - işareti kaldırıldı
            enemy.y += Math.sin(angle) * -10;  // - işareti kaldırıldı
                        }
                    });
                    
                    bullet.lifespan--;
                    if (bullet.lifespan <= 0) {
                        bullets.splice(index, 1);
                    }
                    break;
            case 'punch':
                bullet.y -= bullet.speed;
                bullet.lifespan--;
                if (bullet.lifespan <= 0) {
                    bullets.splice(index, 1);
                }
                break;
                case 'flamethrower':
                    bullet.y -= bullet.speed;
                    bullet.x += bullet.direction;
                    createFlameEffect(bullet.x, bullet.y);
                    bullet.life--;
                    if(bullet.life <= 0) {
                        bullets.splice(index, 1);
                    }
                    break;
                case 'acidSpray':
                bullet.y -= bullet.speed;
                bullet.x += Math.sin(bullet.y/20) * bullet.spreadAngle;
                bullet.radius = 15 + Math.sin(bullet.y/10) * 5; // Daha büyük dalgalanma
                    break;
                case 'droneMissile':
    if (bullet.target && bullet.target.health > 0) {
        // Hedef yönünü hesapla
        const dx = bullet.target.x - bullet.x;
        const dy = bullet.target.y - bullet.y;
        const angle = Math.atan2(dy, dx);
        
        // Yönlendirilmiş hareket
        bullet.x += Math.cos(angle) * bullet.speed;
        bullet.y += Math.sin(angle) * bullet.speed;
    } else {
        // Hedef yoksa düz git
        bullet.y -= bullet.speed;
    }
    break;
    case 'mutationRay':
    bullet.y -= bullet.speed; // Yukarı doğru hareket
    // life değeri azalarak 60 frame sonra yok olur
    bullet.lifespan--;
    if (bullet.lifespan <= 0) {
        bullets.splice(index, 1);
    }
    break;
    case 'fusion':
    bullet.y -= bullet.speed;
    // Parıldama efekti
    createFusionEffect(bullet.x, bullet.y, bullet.radius);
    break;
    case 'laserBeam':
                bullet.y -= bullet.speed;
                createEyeGlowEffect(); // Sürekli göz parıltısı
                break;
                case 'expRounds':
                bullet.y -= bullet.speed;
                bullet.x += bullet.direction * bullet.speed;
                bullet.life--;
                if(bullet.life <= 0) {
                    bullets.splice(index, 1);
                }
                break;
        }

                if (bullet.y < 0 && bullet.type !== 'blackHole') {
                    bullets.splice(index, 1);
                }
            });
        }

        function updateBombs() {
            bombs.forEach((bomb, index) => {
                if (!bomb.isExploded) {
                    bomb.y -= bomb.speed;
                    if (bomb.y < 0) {
                        bombs.splice(index, 1);
                    }
                }
            });
        }
    
        function updateGameColors(theme) {
    switch(theme) {
        case 'red':
            player.color = '#ff0000';
            break;
        case 'green':
            player.color = '#00ff00';
            break;
        case 'black':
            player.color = '#ffffff';
            break;
        default:
            player.color = 'blue';
    }
}

function createBloodParticles(x, y) {
    if (!gameOptions.gore) return;

    const particleCount = 15;
    let effectSound;
    let color;
    
    // Efekt türüne göre renk ve ses belirleme
    switch(currentEffect) {
        case 'angelpop':
            color = '#ffffff';
            effectSound = angelpopSound;
            break;
        case 'demonpop':
            color = '#000000';
            effectSound = demonpopSound;
            break;
        case 'colapop':
            color = '#663300';
            effectSound = colapopSound;
            break;
        case 'neonpop':
            color = '#00ff00';
            effectSound = neonpopSound;
            break;
        default:
            color = '#ff0000';
            effectSound = death3Sound; // Varsayılan kan sesi
    }
    
    // Ses efektini oynat
    if (effectSound) {
        effectSound.currentTime = 0;
        effectSound.volume = soundVolume;
        effectSound.play();
    }
                 
    for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        particles.push({
            x: x,
            y: y,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            size: Math.random() * 3 + 2,
            life: 60,
            color: color
        });
    }
}

// Partikülleri güncelle
function updateParticles() {
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        p.life--;
    });
}

// createHealingEffect fonksiyonunu ekle
function createHealingEffect() {
    const particleCount = 12; // Çember etrafında 12 partikül
    const radius = 30; // Aura çapı
    
    for (let i = 0; i < particleCount; i++) {
        // Çember etrafında eşit aralıklarla partiküller 
        const angle = (i / particleCount) * Math.PI * 2;
        const speed = 2;
        
        particles.push({
            x: player.x + player.width/2 + Math.cos(angle) * radius,
            y: player.y + player.height/2 + Math.sin(angle) * radius,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            size: 4,
            life: 40, // 40 frame ≈ 0.66 saniye
            color: '#33ff33' // Yeşil healing efekti
        });
    }
}

// createAcidEffect fonksiyonunu ekle
function createAcidEffect(x, y) {
    // Partikül sayısını artır
    for(let i = 0; i < 12; i++) {
        particles.push({
            x: x,
            y: y,
            dx: (Math.random() - 0.5) * 6, // Daha hızlı hareket
            dy: (Math.random() - 0.5) * 6,
            size: 5 + Math.random() * 4, // Daha büyük partiküller
            life: 45, // Daha uzun ömür
            color: `rgba(${50 + Math.random() * 100}, 255, ${50 + Math.random() * 100}, 0.7)` // Farklı yeşil tonları
        });
    }
}

// createFlameEffect fonksiyonunu ekle
function createFlameEffect(x, y) {
    // Her alev için çoklu partikül
    for(let i = 0; i < 8; i++) {
        particles.push({
            x: x,
            y: y,
            dx: (Math.random() - 0.5) * 4, // Yatay saçılma
            dy: -Math.random() * 3 - 2, // Yukarı doğru hareket
            size: 6 + Math.random() * 6,
            life: 30 + Math.random() * 20,
            color: `hsla(${20 + Math.random() * 30}, 100%, ${50 + Math.random() * 30}%, ${0.6 + Math.random() * 0.4})` // Turuncu-kırmızı tonları
        });
    }
}

// Mutasyon efekti fonksiyonu
function createMutationEffect(x, y) {
    for(let i = 0; i < 15; i++) {
        particles.push({
            x: x,
            y: y,
            dx: (Math.random() - 0.5) * 5,
            dy: (Math.random() - 0.5) * 5,
            size: 3 + Math.random() * 4,
            life: 40,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`
        });
    }
}

function createExplosionEffect(x, y) {
    // Ana patlama dairesi
    ctx.fillStyle = 'rgba(255, 100, 0, 0.6)';
    ctx.beginPath();
    ctx.arc(x, y, 50, 0, Math.PI * 2);
    ctx.fill();
    
    // Parlak dış halka
    ctx.strokeStyle = 'rgba(255, 200, 0, 0.8)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 55, 0, Math.PI * 2);
    ctx.stroke();
    
    // Parçacık efektleri ekle
    for (let i = 0; i < 20; i++) {
        const angle = (Math.PI * 2) * Math.random();
        const speed = 2 + Math.random() * 3;
        const size = 2 + Math.random() * 4;
        
        particles.push({
            x: x,
            y: y,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            life: 30,
            size: size,
            color: `rgba(255, ${100 + Math.random() * 155}, 0, ${0.8 + Math.random() * 0.2})`
        });
    }
}

// Göz parıltı efekti
function createEyeGlowEffect() {
    // Daha parlak göz efektleri
    for(let i = 0; i < 2; i++) {
        const x = i === 0 ? player.x + 10 : player.x + player.width - 15;
        
        // İç parlama
        particles.push({
            x: x,
            y: player.y + 10,
            dx: 0,
            dy: 0,
            size: 6,
            life: 10,
            color: 'rgba(255, 255, 255, 0.8)'
        });
        
        // Dış kızıl hale
        particles.push({
            x: x,
            y: player.y + 10,
            dx: 0,
            dy: 0,
            size: 12,
            life: 8,
            color: 'rgba(255, 0, 0, 0.4)'
        });
    }
}

// Yeni efekt fonksiyonları
function createFusionEffect(x, y, radius) {
    for (let i = 0; i < 4; i++) {
        const angle = (Math.PI * 2) * Math.random();
        particles.push({
            x: x + Math.cos(angle) * radius,
            y: y + Math.sin(angle) * radius,
            dx: (Math.random() - 0.5) * 2,
            dy: (Math.random() - 0.5) * 2,
            size: 4 + Math.random() * 4,
            life: 20,
            color: `hsla(${200 + Math.random() * 160}, 100%, 70%, 0.8)`
        });
    }
}

function createFusionExplosion(x, y, radius) {
    for (let i = 0; i < 30; i++) {
        const angle = (Math.PI * 2) * Math.random();
        const distance = Math.random() * radius;
        particles.push({
            x: x + Math.cos(angle) * distance,
            y: y + Math.sin(angle) * distance,
            dx: Math.cos(angle) * 5,
            dy: Math.sin(angle) * 5,
            size: 5 + Math.random() * 5,
            life: 40,
            color: `hsla(${200 + Math.random() * 160}, 100%, 70%, 0.8)`
        });
    }
}

// Rastgele mutasyon seçici
function randomMutation() {
    const mutations = [
        'size_increase',
        'speed_decrease',
        'color_change',
        'shape_distort'
    ];
    return mutations[Math.floor(Math.random() * mutations.length)];
}

// Şarj efekti oluşturma fonksiyonu
function createChargeEffect() {
    const particleCount = 16;
    const currentTime = Date.now();
    const chargeTime = Math.min(currentTime - fusionChargeStartTime, maxFusionChargeTime);
    const chargeRatio = chargeTime / maxFusionChargeTime;
    
    // Mevcut partikülleri temizle
    chargeParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
        // Çember etrafında eşit aralıklarla partiküller
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 40 + (chargeRatio * 20); // Şarj oldukça genişler
        
        chargeParticles.push({
            x: player.x + player.width/2 + Math.cos(angle) * radius,
            y: player.y + player.height/2 + Math.sin(angle) * radius,
            angle: angle,
            radius: radius,
            color: `hsl(${200 + chargeRatio * 160}, 100%, 50%)`
        });
    }
}

        // Çarpışma kontrolü fonksiyonları
        function detectCollisions() {
            bullets.forEach((bullet, bulletIndex) => {
                enemies.forEach((enemy, enemyIndex) => {
                    if (bullet.x < enemy.x + enemy.width &&
                        bullet.x + 5 > enemy.x &&
                        bullet.y < enemy.y + enemy.height &&
                        bullet.y + 10 > enemy.y) {
        
                        let hasKilledEnemy = false;
                        
                        // Mermi türüne göre hasar ve efektler
                        switch(bullet.type) {
                            case 'laser':
                                enemy.health -= 50;
                                break;
                            case 'triple':
                            case 'spread':
                            case 'expRounds':
                                enemy.health -= 50;
                                break;
                            case 'lightning':
                                enemy.health -= 15;
                                break;
                            case 'plasmaBall':
                                enemy.health -= 150;
                                createExplosionEffect(bullet.x, bullet.y);
                                break;
                                case 'blackHole':
                                    enemy.health -= bullet.damage;
                                    // Alan hasarı
                                    enemies.forEach(nearbyEnemy => {
                                        if (nearbyEnemy !== enemy) {
                                            const distance = Math.hypot(
                                                nearbyEnemy.x - bullet.x,
                                                nearbyEnemy.y - bullet.y
                                            );
                                            if (distance < bullet.radius * 3) {
                                                nearbyEnemy.health -= bullet.damage * 1;
                                            }
                                        }
                                    });
                                    break;
                            case 'punch':
                                enemy.health -= 75;
                                punchHitSound.currentTime = 0;
                                punchHitSound.volume = soundVolume;
                                punchHitSound.play();
                                break;
                            case 'energy':
                                enemy.health -= 60;
                                break;
                            case 'flamethrower':
                                enemy.health -= 40;
                                createFlameEffect(bullet.x, bullet.y);
                                break;
                            case 'lifestealer':
                                const oldHealth = health;
                                enemy.health -= 40;
                                health = Math.min(health + 10, 100);
                                if (health > oldHealth) {
                                    healingSound.currentTime = 0;
                                    healingSound.volume = soundVolume;
                                    healingSound.play();
                                    createHealingEffect();
                                }
                                break;
                            case 'acidSpray':
                                enemy.health -= 2.5;
                                createAcidEffect(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                                break;
                                case 'droneMissile':
                                    enemy.health -= bullet.damage;
                                    
                                    // Patlama efekti ekle
                                    createExplosionEffect(bullet.x, bullet.y);
                                    
                                    // Patlama sesi çal
                                    explosionSound.currentTime = 0;
                                    explosionSound.volume = soundVolume;
                                    explosionSound.play();
                                    
                                    // Alan hasarı efektleri
                                    enemies.forEach((nearbyEnemy, nearbyIndex) => {
                                        if (nearbyEnemy !== enemy) {
                                            const distance = Math.hypot(
                                                nearbyEnemy.x - bullet.x,
                                                nearbyEnemy.y - bullet.y
                                            );
                                            const radius = bullet.splashRadius;
                                            
                                            if (distance < radius) {
                                                const damageMultiplier = 1 - (distance / radius);
                                                nearbyEnemy.health -= bullet.damage * damageMultiplier;
                                                
                                                if (nearbyEnemy.health <= 0) {
                                                    handleEnemyDeath(nearbyEnemy, nearbyIndex);
                                                }
                                            }
                                        }
                                    });
                                    break;
                                    case 'laserBeam':
                        enemy.health -= bullet.damage;
                        // Işın efekti
                        particles.push({
                            x: enemy.x + enemy.width/2,
                            y: enemy.y + enemy.height/2,
                            dx: 0,
                            dy: 0,
                            size: 10,
                            life: 10,
                            color: 'rgba(255, 0, 0, 0.8)'
                        });
                        bullets.splice(bulletIndex, 1);
                        break;
                            case 'mutationRay':
                            case 'fusion':
                                enemy.health -= bullet.damage;
                                
                                // Alan hasarı efektleri
                                if (bullet.type === 'droneMissile' || bullet.type === 'fusion') {
                                    enemies.forEach((nearbyEnemy, nearbyIndex) => {
                                        if (nearbyEnemy !== enemy) {
                                            const distance = Math.hypot(
                                                nearbyEnemy.x - bullet.x,
                                                nearbyEnemy.y - bullet.y
                                            );
                                            const radius = bullet.type === 'droneMissile' ? bullet.splashRadius : bullet.radius * 2;
                                            
                                            if (distance < radius) {
                                                const damageMultiplier = 1 - (distance / radius);
                                                nearbyEnemy.health -= bullet.damage * damageMultiplier;
                                                
                                                if (nearbyEnemy.health <= 0) {
                                                    handleEnemyDeath(nearbyEnemy, nearbyIndex);
                                                }
                                            }
                                        }
                                    });
                                }
                                
                                if (bullet.type === 'mutationRay') {
                                    createMutationEffect(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                                    if (!enemy.mutations) enemy.mutations = [];
                                    if (enemy.mutations.length < 3) {
                                        enemy.mutations.push(randomMutation());
                                        enemy.color = `rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`;
                                        enemy.width = Math.max(30, enemy.width + (Math.random()*20 - 10));
                                        enemy.height = Math.max(30, enemy.height + (Math.random()*20 - 10));
                                    }
                                }
                                break;
                                case 'expRounds':
                bullet.y -= bullet.speed;
                bullet.x += bullet.direction * bullet.speed;
                bullet.life--;
                if(bullet.life <= 0) {
                    bullets.splice(index, 1);
                }
                break;
                            default:
                                enemy.health -= 25;
                        }
        
                        // Mermiyi yok et (kara delik hariç)
                        if (bullet.type !== 'blackHole') {
                            bullets.splice(bulletIndex, 1);
                        }
        
                        // Düşman öldü mü kontrol et
                        if (enemy.health <= 0) {
                            handleEnemyDeath(enemy, enemyIndex);
                        }
        
                        // Hasar istatistiklerini güncelle
                        updateStats('damage', bullet.damage || 25);
                    }
                });
            });
        }
        
        function handleEnemyDeath(enemy, index) {
            // Para ve skor hesapla
            let scoreGain, currencyGain;
            
            switch(enemy.type) {
                case 'normal':
                    scoreGain = 250; currencyGain = 10;
                    break;
                case 'tank':
                    scoreGain = 500; currencyGain = 25;
                    break;
                case 'fast':
                    scoreGain = 750; currencyGain = 35;
                    break;
                case 'giant':
                    scoreGain = 4500; currencyGain = 400;
                    break;
                case 'white':
                    scoreGain = 1500; currencyGain = 100;
                    death2Sound.currentTime = 0;
                    death2Sound.volume = soundVolume;
                    death2Sound.play();
                    break;
                case 'sigma':
                    scoreGain = 350; currencyGain = 50;
                    deathSound.currentTime = 0;
                    deathSound.volume = soundVolume;
                    deathSound.play();
                    break;
                default:
                    scoreGain = 100; currencyGain = 5;
            }
        
            // Kan efekti
            if (enemy.type !== 'sigma' && enemy.type !== 'white') {
                createBloodParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2);
                death3Sound.currentTime = 0;
                death3Sound.volume = soundVolume;
                death3Sound.play();
            }
        
            // Düşmanı yok et ve istatistikleri güncelle
            enemies.splice(index, 1);
            updateScore(scoreGain);
            currency += currencyGain;
            gameStats.totalCurrency += currencyGain;
            updateCurrencyDisplay();
            updateStats('kill');
        }

        // Bomba çarpışma kontrolünü güncelle
function detectBombCollisions() {
    bombs.forEach((bomb, bombIndex) => {
        if (bomb.isExploded) return;
        
        enemies.forEach((enemy, enemyIndex) => {
            if (bomb.x < enemy.x + enemy.width &&
                bomb.x + 10 > enemy.x &&
                bomb.y < enemy.y + enemy.height &&
                bomb.y + 10 > enemy.y) {
                
                // Patlama efektini hemen oluştur
                createExplosionEffect(bomb.x, bomb.y);
                
                // Ses efektini çal
                explosionSound.currentTime = 0;
                explosionSound.volume = soundVolume;
                explosionSound.play();
                
                // Bombayı işaretle ve kaldır
                bomb.isExploded = true;
                bombs.splice(bombIndex, 1);
                
                // Yakındaki düşmanlara hasar ver
                enemies.forEach((nearbyEnemy, nearbyIndex) => {
                    const distance = Math.hypot(
                        nearbyEnemy.x - bomb.x,
                        nearbyEnemy.y - bomb.y
                    );
                    
                    if (distance < 150) {
                        nearbyEnemy.health -= Math.max(200 - distance, 50);
                        if (nearbyEnemy.health <= 0) {
                            enemies.splice(nearbyIndex, 1);
                            updateScore(500);
                        }
                    }
                });
            }
        });
    });
}

        function checkPlayerCollision() {
        if (isShieldActive) return;

        enemies.forEach((enemy, index) => {
            if (player.x < enemy.x + enemy.width &&
                player.x + player.width > enemy.x &&
                player.y < enemy.y + enemy.height &&
                player.y + player.height > enemy.y) {
                
                // Sarı (giant) düşman için özel hasar
                const damage = enemy.type === 'giant' ? 30 : 10;
                health -= damage;
                enemies.splice(index, 1);
    
                updateHealth();
            }
        });
    }


        // Çarpışma kontrol fonksiyonlarından sonra ekle (yaklaşık line 900)
// Stats güncelleme fonksiyonunu güncelle
function updateStats(statType, value = 1) {
    switch(statType) {
        case 'kill':
            gameStats.totalKills += value;
            break;
        case 'damage':
            gameStats.totalDamageDealt += value;
            break;
        case 'game':
            gameStats.totalGames += value;
            break;
        case 'ultimate':
            gameStats.ultimatesUsed += value;
            break;
        case 'dash':
            gameStats.dashesUsed += value;
            break;
    }
    
    // Yüksek skoru güncelle
    if(score > gameStats.highScore) {
        gameStats.highScore = score;
    }
    
    // LocalStorage'a kaydet
    localStorage.setItem('gameStats', JSON.stringify(gameStats));
    
    // Görüntüyü güncelle
    updateStatsDisplay();
}

// Stats gösterim fonksiyonunu güncelle
function updateStatsDisplay() {
    const statsHtml = `
        <div class="stats-panel">
            <div class="stat-item">En Yüksek Skor: ${gameStats.highScore}</div>
            <div class="stat-item">Toplam Öldürme: ${gameStats.totalKills}</div>
            <div class="stat-item">Toplam Oyun: ${gameStats.totalGames}</div>
            <div class="stat-item">Toplam Hasar: ${Math.floor(gameStats.totalDamageDealt)}</div>
            <div class="stat-item">Ultimate Kullanımı: ${gameStats.ultimatesUsed}</div>
            <div class="stat-item">Dash Kullanımı: ${gameStats.dashesUsed}</div>
        </div>
    `;
    
    const existingStats = document.querySelector('.stats-panel');
    if (existingStats) {
        existingStats.remove();
    }
    
    document.querySelector('.menu-content').insertAdjacentHTML('beforeend', statsHtml);
}

function saveStats() {
    localStorage.setItem('gameStats', JSON.stringify(gameStats)); // Objeyi JSON string'e çevir
}

        // Ana oyun döngüsü ve güncelleme fonksiyonları
        function update() {
    updatePlayerMovement();
    updateBullets();
    updateBombs();
    updateParticles();
    enemies.forEach(e => {
        // Giant tipi düşmanlar 4 kat daha yavaş hareket eder
        e.y += e.type === 'giant' ? 0.5 : 1 + (level * 0.1);
        if (e.type === 'fast') e.y += 1;
    });
    detectCollisions();
    detectBombCollisions();
    checkPlayerCollision();

    if (Math.random() < 0.02 + (level * 0.005)) createEnemy();
    
    if (health <= 0) {
        showDefeatScreen();
    }

    bullets = bullets.filter(b => b.y > 0);
    bombs = bombs.filter(b => !b.isExploded && b.y > 0);
    enemies = enemies.filter(e => e.y < canvas.height);

    updateHealth();
    updateLevel();

    if (enemies.length === 0 && score > 10000) {
        showVictoryScreen();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Oyuncu çizimi
    drawPlayer();

    // Dron çizimi
    if (showDrone && currentCategory === 2 && shootingMode === 'droneMissile') {
        ctx.drawImage(droneImage, 
            player.x - 25, // x pozisyonu 
            player.y + 10, // y pozisyonu
            50, // genişlik
            40  // yükseklik
        );
    }

    // Şarj efektini çiz
if (chargingFusion) {
    createChargeEffect();
    
    // Partikülleri çiz
    chargeParticles.forEach(particle => {
        ctx.beginPath();
        ctx.fillStyle = particle.color;
        ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Partikül ile oyuncu arasına enerji çizgisi
        ctx.beginPath();
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 2;
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(player.x + player.width/2, player.y + player.height/2);
        ctx.stroke();
    });
    
    // Şarj yüzdesini göster
    const chargePercent = Math.min(((Date.now() - fusionChargeStartTime) / maxFusionChargeTime) * 100, 100);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Şarj: %${Math.floor(chargePercent)}`, player.x, player.y - 20);
}

    // Mermileri çiz
    bullets.forEach(b => {
        switch(b.type) {
            case 'beam':
                ctx.fillStyle = b.color;
                ctx.fillRect(b.x, b.y, 10, 20);
                break;
            case 'triple':
                ctx.fillStyle = '#8B0000';
                ctx.fillRect(b.x, b.y, 3, 20);
                break;
            case 'spread':
                ctx.fillStyle = 'yellow';
                ctx.fillRect(b.x, b.y, 5, 10);
                break;
                case 'lightning':
    // Ana yıldırım çizgisi
    ctx.beginPath();
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    
    // Yıldırım zigzag efekti
    let segmentHeight = 10; // Daha kısa segmentler
    let segments = Math.floor((b.y - (b.y - 30)) / segmentHeight);
    let startX = b.x;
    let startY = b.y;
    
    ctx.moveTo(startX, startY);
    
    // Ana yıldırım
    for (let i = 0; i < segments; i++) {
        let nextY = startY - segmentHeight;
        let nextX = startX + (Math.random() * 20 - 10);
        ctx.lineTo(nextX, nextY);
        startX = nextX;
        startY = nextY;
    }
    
    ctx.stroke();
    
    // Yan dallar (mini yıldırımlar)
    if (Math.random() < 0.3) { // %30 şansla yan dal oluştur
        let branchX = startX + (Math.random() * 30 - 15);
        let branchY = startY - (Math.random() * 20);
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(branchX, branchY);
        ctx.stroke();
    }
    
    // Parıltı efekti
    for (let i = 0; i < 2; i++) {
        particles.push({
            x: b.x,
            y: b.y,
            dx: (Math.random() - 0.5) * 3,
            dy: -Math.random() * 2,
            size: 2 + Math.random() * 2,
            life: 10,
            color: `rgba(0, 255, 255, ${0.7 + Math.random() * 0.3})`
        });
    }
    
    // Gölgelendirmeyi sıfırla
    ctx.shadowBlur = 0;
    break;
                case 'plasmaBall':
                    // 1. Ana plazma topu
                    const plasmaTime = Date.now() * 0.003; // Animasyon için zaman faktörü
                    const plasmaPulseSize = Math.sin(plasmaTime) * 4; // Nabız efekti
                    
                    // 2. Dış ışıma halkası
                    const glowGradient = ctx.createRadialGradient(
                        b.x, b.y, 0,
                        b.x, b.y, b.radius * 2
                    );
                    glowGradient.addColorStop(0, 'rgba(0, 255, 0, 0.3)');
                    glowGradient.addColorStop(0.5, 'rgba(0, 255, 0, 0.1)');
                    glowGradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
                    
                    ctx.fillStyle = glowGradient;
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, b.radius * 2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 3. İç plazma topu
                    ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, b.radius + plasmaPulseSize, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 4. Parlak merkez
                    ctx.fillStyle = 'rgba(220, 255, 220, 0.9)';
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, b.radius * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 5. Enerji dalgaları
                    for (let i = 0; i < 3; i++) {
                        const waveRadius = b.radius * (1.5 + i * 0.5);
                        const waveOffset = plasmaTime + i * (Math.PI / 3);
                        
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 255, 0, ${0.3 - i * 0.1})`;
                        ctx.lineWidth = 2;
                        
                        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
                            const distort = Math.sin(angle * 6 + waveOffset) * 5;
                            const x = b.x + Math.cos(angle) * (waveRadius + distort);
                            const y = b.y + Math.sin(angle) * (waveRadius + distort);
                            
                            if (angle === 0) {
                                ctx.moveTo(x, y);
                            } else {
                                ctx.lineTo(x, y);
                            }
                        }
                        ctx.closePath();
                        ctx.stroke();
                    }
                    break;
                case 'blackHole':
    // 1. Yarıçap ve saydamlık animasyonu
    if (b.radius < b.maxRadius) {
        b.radius += 0.5;
    }
    if (b.alpha < 1) {
        b.alpha += 0.05;
    }
    
    // 2. Kara delik efekti
    ctx.save();
    
    try {
        // İç ve dış yarıçap tanımları
        const innerRadius = Math.max(1, b.radius * 0.5); // Minimum 1 piksel
        const outerRadius = b.radius * 2;
        
        // Gradient oluştur
        const gradient = ctx.createRadialGradient(
            b.x, b.y, innerRadius,  // İç daire
            b.x, b.y, outerRadius   // Dış daire
        );
        
        // Gradient renkleri
        gradient.addColorStop(0, `rgba(0, 0, 0, ${b.alpha})`);
        gradient.addColorStop(0.6, `rgba(75, 0, 130, ${b.alpha * 0.7})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        // Çizim
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(b.x, b.y, outerRadius, 0, Math.PI * 2);
        ctx.fill();
        
    } catch (error) {
        // Hata durumunda basit bir fallback çizim
        ctx.beginPath();
        ctx.fillStyle = `rgba(75, 0, 130, ${b.alpha})`;
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // 3. Rotasyon güncelleme
    if (!b.rotation) b.rotation = 0;
    b.rotation += 0.1;
    
    ctx.restore();
    break;
            case 'punch':
                ctx.fillStyle = 'blue';
                ctx.beginPath();
                ctx.arc(b.x, b.y, 10, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'energy':
                ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
                ctx.beginPath();
                ctx.arc(b.x, b.y, 8, 0, Math.PI * 3);
                ctx.fill();
                break;
            case 'lifestealer':
                ctx.fillStyle = 'purple';
                ctx.beginPath();
                ctx.arc(b.x, b.y, 10, 0, Math.PI * 2);
                ctx.fill();
                break;
                case 'flamethrower':
                    const flameGradient = ctx.createRadialGradient(
                        b.x, b.y, 0,
                        b.x, b.y, 15
                    );
                    flameGradient.addColorStop(0, 'rgba(255, 200, 0, 0.8)');
                    flameGradient.addColorStop(0.5, 'rgba(255, 100, 0, 0.6)');
                    flameGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
                    ctx.fillStyle = flameGradient;
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, 15, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 'acidSpray':
                    const gradient = ctx.createRadialGradient(
                        b.x, b.y, 0,
                        b.x, b.y, b.radius
                    );
                    gradient.addColorStop(0, 'rgba(144, 238, 144, 0.8)');
                    gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
                    ctx.fillStyle = gradient;
                    ctx.beginPath();
                    ctx.arc(b.x, b.y, b.radius * 3, 0, Math.PI * 2); // 2'den 3'e çıkarttık
                    ctx.fill();
                    break;
                    case 'droneMissile':
    // Görseli çiz
    ctx.save();
    // Hedefe doğru döndür
    if (b.target) {
        const angle = Math.atan2(
            b.target.y - b.y,
            b.target.x - b.x
        );
        ctx.translate(b.x, b.y);
        ctx.rotate(angle + Math.PI/2);
        ctx.translate(-b.x, -b.y);
    }
    // Görseli çiz (20x40 boyutunda)
    ctx.drawImage(droneMissileImage, b.x - 10, b.y - 20, 20, 40);
    
    // Motor ateşi partikülleri
    for(let i = 0; i < 3; i++) { // Her framede 3 partikül
        const spread = 4; // Yayılma genişliği
        const speed = 2 + Math.random() * 2; // Partikül hızı
        
        // Partiküllerin başlangıç pozisyonu
        const startX = b.x + (Math.random() - 0.5) * spread;
        const startY = b.y + 20; // Füzenin alt kısmı
        
        // Renk varyasyonları
        const colors = [
            'rgba(255, 165, 0, 0.6)', // Turuncu
            'rgba(255, 69, 0, 0.6)',  // Kırmızı-turuncu
            'rgba(255, 215, 0, 0.6)'  // Altın sarısı
        ];
        
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.beginPath();
        ctx.arc(startX, startY, 2 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Partikülleri particles array'ine ekle
        particles.push({
            x: startX,
            y: startY,
            dx: (Math.random() - 0.5) * 2,
            dy: speed,
            size: 2 + Math.random() * 2,
            life: 20,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
    ctx.restore();
    break;
    case 'mutationRay':
    const glowSize = 15;
    // Işın efekti
    ctx.strokeStyle = `hsl(${Date.now() % 360}, 100%, 50%)`;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x, b.y - 20);
    ctx.stroke();
    // Parlama efekti
    ctx.fillStyle = `hsla(${Date.now() % 360}, 100%, 50%, 0.3)`;
    ctx.beginPath();
    ctx.arc(b.x, b.y, glowSize, 0, Math.PI * 2);
    ctx.fill();
    break;
    
    // draw() fonksiyonundaki case 'laserBeam' bloğunun sonunu tamamla
    case 'laserBeam':
        ctx.save();
        
        // Dış parıltı katmanı
    const outerGlow = ctx.createLinearGradient(b.x, b.y, b.x, b.y - b.length);
    outerGlow.addColorStop(0, 'rgba(255, 0, 0, 0.2)');
    outerGlow.addColorStop(0.5, 'rgba(255, 0, 0, 0.1)');
    outerGlow.addColorStop(1, 'rgba(255, 0, 0, 0)');
    
    ctx.shadowColor = b.core;
    ctx.shadowBlur = 20;
    ctx.fillStyle = outerGlow;
    ctx.fillRect(b.x - b.width * 4, b.y - b.length, b.width * 8, b.length);
    
    // Orta katman
    const midGlow = ctx.createLinearGradient(b.x, b.y, b.x, b.y - b.length);
    midGlow.addColorStop(0, 'rgba(255, 100, 100, 0.5)');
    midGlow.addColorStop(1, 'rgba(255, 0, 0, 0.2)');
    
    ctx.shadowBlur = 10;
    ctx.fillStyle = midGlow;
    ctx.fillRect(b.x - b.width * 2, b.y - b.length, b.width * 4, b.length);
    
    // Ana ışın çekirdeği
    ctx.shadowBlur = 5;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(b.x - b.width/2, b.y - b.length, b.width, b.length);
    
    // Dinamik enerji halkaları
    const time = Date.now() * 0.01;
    const pulseSize = Math.sin(time) * 3;
    
    for(let i = 0; i < 2; i++) {
        const ringSize = b.width * (2 + i) + pulseSize;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 0, 0, ${0.3 - i * 0.1})`;
        ctx.arc(b.x, b.y - b.length/2, ringSize, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Enerji partikülleri
    for(let i = 0; i < 3; i++) {
        particles.push({
            x: b.x + (Math.random() - 0.5) * 8,
            y: b.y - b.length + Math.random() * b.length,
            dx: (Math.random() - 0.5) * 3,
            dy: -Math.random() * 3,
            size: 2 + Math.random() * 3,
            life: 15,
            color: `hsl(${Math.random() * 20}, 100%, 70%)`
        });
    }
    
    ctx.restore();
    break;
    case 'expRounds':
    // Ana mermi görünümü
    ctx.fillStyle = '#ff4400';
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
    ctx.fill();

    // Ateş efekti partikülleri
    const particleCount = 3; // Her mermi için 3 partikül
    for(let i = 0; i < particleCount; i++) {
        const spread = 3; // Yayılma genişliği
        
        // Partiküllerin başlangıç pozisyonu (merminin arkasında)
        const startX = b.x + (Math.random() - 0.5) * spread;
        const startY = b.y + 5; // Merminin biraz arkası
        
        // Ateş renk varyasyonları
        const fireColors = [
            'rgba(255, 50, 0, 0.6)',   // Turuncu-kırmızı
            'rgba(255, 150, 0, 0.5)',  // Turuncu
            'rgba(255, 200, 0, 0.4)'   // Sarı
        ];
        
        // Partikül oluştur
        particles.push({
            x: startX,
            y: startY,
            dx: (Math.random() - 0.5) * 2,
            dy: 1 + Math.random(),
            size: 2 + Math.random() * 2,
            life: 10,
            color: fireColors[Math.floor(Math.random() * fireColors.length)]
        });
    }
    break;
            default:
                ctx.fillStyle = b.type === 'laser' ? 'cyan' : 'orange';
                ctx.fillRect(b.x, b.y, 5, 10);
        }
    });

    // Bombaları çiz
    bombs.forEach(b => {
        if (!b.isExploded) {
            ctx.fillStyle = 'gray';
            ctx.beginPath();
            ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Düşmanları çiz
    enemies.forEach(e => {
        if (e.image) {
            ctx.drawImage(e.image, e.x, e.y, e.width, e.height);
        } else {
            ctx.fillStyle = e.color;
            ctx.fillRect(e.x, e.y, e.width, e.height);
        }
    });
    
    // Partikülleri çiz
    particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / 60; // Zamanla solma efekti
        
        // Kan partikülü ise özel efekt uygula
        if (p.color === '#ffffff') { // angelpop
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 10;
        } else if (p.color === '#000000') { // demonpop
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 10;
        } else if (p.color === '#663300') { // colapop
            ctx.shadowColor = '#4d2600';
            ctx.shadowBlur = 5;
        } else if (p.color === '#00ff00') { // neonpop
            ctx.shadowColor = '#00ff00';
            ctx.shadowBlur = 15;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Gölgelendirmeyi sıfırla
        ctx.shadowBlur = 0;
    });

    ctx.globalAlpha = 1;
}

        // Oyun kontrol fonksiyonları
        let keyState = {};

        document.addEventListener("keydown", function(event) {
    event.preventDefault();
    keyState[event.code] = true;

    if(event.code === "KeyH") {
        // Skinler arasında geçiş
        const skinOrder = ['default', 'angelskin', 'demonskin', 'neonskin', 'colaskin', 'funnyskin', 'sigmaskin', 'ascapedskin', 'yeezusskin'];
        let currentIndex = skinOrder.indexOf(currentSkin);
        
        // Bir sonraki skin'e geç (eğer satın alınmışsa)
        let found = false;
        let tries = 0;
        while (!found && tries < skinOrder.length) {
            currentIndex = (currentIndex + 1) % skinOrder.length;
            let nextSkin = skinOrder[currentIndex];
            
            // Eğer varsayılan skin veya satın alınmış bir skin ise seç
            if (nextSkin === 'default' || purchasedItems.skins.includes(nextSkin)) {
                currentSkin = nextSkin;
                found = true;
            }
            tries++;
        }
        
        // Bildirim göster
        showNotification(`Skin: ${currentSkin === 'default' ? 'Varsayılan' : currentSkin}`, 'success');
        saveEquippedItems();
    }
    
    if(event.code === "KeyJ") {
        // Efektler arasında geçiş
        const effectOrder = ['default', 'angelpop', 'demonpop', 'neonpop', 'colapop'];
        let currentIndex = effectOrder.indexOf(currentEffect);
        
        // Bir sonraki efekte geç (eğer satın alınmışsa)
        let found = false;
        let tries = 0;
        while (!found && tries < effectOrder.length) {
            currentIndex = (currentIndex + 1) % effectOrder.length;
            let nextEffect = effectOrder[currentIndex];
            
            // Eğer varsayılan efekt veya satın alınmış bir efekt ise seç
            if (nextEffect === 'default' || purchasedItems.effects.includes(nextEffect)) {
                currentEffect = nextEffect;
                found = true;
            }
            tries++;
        }
        
        // Bildirim göster
        showNotification(`Efekt: ${currentEffect === 'default' ? 'Varsayılan' : currentEffect}`, 'success');
        saveEquippedItems();
    }
    
    if (event.code === "KeyC") dash();
    if (event.code === "KeyQ") activateShield();
    if (event.code === "KeyR") activateUltimate();
    if (event.code === "KeyG") {
        currentCategory = (currentCategory % totalCategories) + 1;
        updateFireModeDisplay();
        return;
    }

    switch(event.code) {
        case "Digit1": 
            shootingMode = currentCategory === 1 ? 'auto' :
                          currentCategory === 2 ? 'energy' : 'minigun';
            break;
        case "Digit2": 
            shootingMode = currentCategory === 1 ? 'laser' :
                          currentCategory === 2 ? 'lifestealer' : 'unknown';
            break;
        case "Digit3": 
            shootingMode = currentCategory === 1 ? 'bomb' :
                          currentCategory === 2 ? 'flamethrower' : 'unknown';
            break;
        case "Digit4": 
            shootingMode = currentCategory === 1 ? 'beam' :
                          currentCategory === 2 ? 'acidSpray' : 'unknown';
            break;
        case "Digit5": 
            shootingMode = currentCategory === 1 ? 'triple' :
                          currentCategory === 2 ? 'droneMissile' : 'unknown';
            if (currentCategory === 2) {
                showDrone = true;
                showDroneText();
            }
            break;
        case "Digit6": 
            shootingMode = currentCategory === 1 ? 'spread' :
                          currentCategory === 2 ? 'mutationRay' : 'unknown';
            break;
        case "Digit7": 
            shootingMode = currentCategory === 1 ? 'lightning' :
                          currentCategory === 2 ? 'fusion' : 'unknown';
            break;
        case "Digit8": 
            shootingMode = currentCategory === 1 ? 'plasmaBall' :
                          currentCategory === 2 ? 'laserBeam' : 'unknown';
            break;
        case "Digit9": 
            shootingMode = currentCategory === 1 ? 'blackHole' :
                          currentCategory === 2 ? 'expRounds' : 'unknown';
            break;
        case "Digit0": 
            shootingMode = 'punch';
            break;
    }
    updateFireModeDisplay();

    // Oyun başlangıcında ve item satın alındığında mevcut itemleri güncelle
window.addEventListener('load', updateAvailableItems);
function purchaseItem(itemId) {
    // Mevcut satın alma kodunun sonuna ekle
    updateAvailableItems();
}
});

function updateFireModeDisplay() {
    const fireModeElement = document.getElementById('fireMode');
    if (fireModeElement) {
        fireModeElement.innerHTML = `
            <i data-lucide="target"></i>
            <span>Ateş Modu: ${shootingMode} (Kategori ${currentCategory})</span>
        `;
        lucide.createIcons();
    }
}

        document.addEventListener("keyup", function(event) {
            keyState[event.code] = false;
        });

        function updatePlayerMovement() {
            if (keyState["KeyW"] && player.y > 0) player.y -= 3;
            if (keyState["KeyA"] && player.x > 0) player.x -= 3;
            if (keyState["KeyS"] && player.y < canvas.height - player.height) player.y += 3;
            if (keyState["KeyD"] && player.x < canvas.width - player.width) player.x += 3;
        }

        function updateMinimap() {
            const minimap = document.getElementById('minimapCanvas');
            const mctx = minimap.getContext('2d');
            
            // Minimap'i temizle
            mctx.clearRect(0, 0, minimap.width, minimap.height);
            
            // Ölçeklendirme faktörü
            const scaleX = minimap.width / canvas.width;
            const scaleY = minimap.height / canvas.height;
            
            // Oyuncuyu çiz
            mctx.fillStyle = 'blue';
            mctx.fillRect(
                player.x * scaleX,
                player.y * scaleY,
                player.width * scaleX,
                player.height * scaleY
            );
            
            // Düşmanları çiz
            enemies.forEach(enemy => {
                mctx.fillStyle = enemy.color;
                mctx.fillRect(
                    enemy.x * scaleX,
                    enemy.y * scaleY,
                    enemy.width * scaleX,
                    enemy.height * scaleY
                );
            });
        }
        
        function updateCooldowns() {
            // Dash cooldown
            const dashBar = document.querySelector('#dashCooldown .cooldown-bar');
            if (!canDash) {
                dashBar.style.setProperty('--progress', '0%');
                dashBar.style.setProperty('--duration', `${dashCooldown}ms`);
            } else {
                dashBar.style.setProperty('--progress', '100%');
            }
            
            // Shield cooldown
    const shieldBar = document.querySelector('#shieldCooldown .cooldown-bar');
    if (!canUseShield) {
        shieldBar.style.setProperty('--progress', '0%');
        shieldBar.style.setProperty('--duration', `${shieldCooldown}ms`);
        
        setTimeout(() => {
            shieldBar.style.setProperty('--progress', '100%');
            shieldBar.style.setProperty('--duration', '0ms');
        }, shieldCooldown);
    }
    
    // Ultimate cooldown
    const ultBar = document.querySelector('#ultimateCooldown .cooldown-bar');
    if (!canUseUltimate) {
        ultBar.style.setProperty('--progress', '0%');
        ultBar.style.setProperty('--duration', `${ultimateCooldown}ms`);
        
        setTimeout(() => {
            ultBar.style.setProperty('--progress', '100%');
            ultBar.style.setProperty('--duration', '0ms');
        }, ultimateCooldown);
    }
}

        // Oyun döngüsünü güncelleyin
function gameLoop() {
    if (!gameStarted) return;
    
    frame++; // Her döngüde frame'i arttır
    updatePlayerMovement();
    update();
    draw();
    updateMinimap();
    updateCooldowns();
    requestAnimationFrame(gameLoop);
}

        // Kategori 1 ateş modları kontrol fonksiyonları
        function startAutoFire() {
            if (autoFireInterval) return;
            autoFireInterval = setInterval(() => {
                if (shootingMode === 'auto') shoot();
            }, 100);
        }

        function stopAutoFire() {
            clearInterval(autoFireInterval);
            autoFireInterval = null;
        }

        function startLaserFire() {
            if (laserInterval) return;
            laserInterval = setInterval(() => {
                if (shootingMode === 'laser') shootLaser();
            }, 300);
        }

        function stopLaserFire() {
            clearInterval(laserInterval);
            laserInterval = null;
        }

        function startBeamFire() {
            if (beamInterval) return;
            beamInterval = setInterval(() => {
                if (shootingMode === 'beam') shootBeam();
            }, 120);
        }

        function stopBeamFire() {
            clearInterval(beamInterval);
            beamInterval = null;
        }

        function startTripleFire() {
            if (tripleFireInterval) return;
            tripleFireInterval = setInterval(() => {
                if (shootingMode === 'triple') shootTriple();
            }, 200);
        }

        function stopTripleFire() {
            clearInterval(tripleFireInterval);
            tripleFireInterval = null;
        }

        function startBombFire() {
            if (bombInterval) return;
            bombInterval = setInterval(() => {
                if (shootingMode === 'bomb') throwBomb();
            }, 750);
        }

        function stopBombFire() {
            clearInterval(bombInterval);
            bombInterval = null;
        }

        function startSpreadFire() {
            if (spreadInterval) return;
            spreadInterval = setInterval(() => {
                if (shootingMode === 'spread') shootSpread();
            }, 550);
        }

        function stopSpreadFire() {
            clearInterval(spreadInterval);
            spreadInterval = null;
        }

        function startLightningFire() {
            if (lightningInterval) return;
            lightningInterval = setInterval(() => {
                if (shootingMode === 'lightning') shootLightning();
            }, 30);
        }

        function stopLightningFire() {
            clearInterval(lightningInterval);
            lightningInterval = null;
        }

        function startPlasmaBallFire() {
            if (plasmaBallInterval) return;
            plasmaBallInterval = setInterval(() => {
                if (shootingMode === 'plasmaBall') shootPlasmaBall();
            }, 300);
        }

        function stopPlasmaBallFire() {
            clearInterval(plasmaBallInterval);
            plasmaBallInterval = null;
        }

        function startBlackHoleFire() {
            if (blackHoleInterval) return;
            blackHoleInterval = setInterval(() => {
                if (shootingMode === 'blackHole') createBlackHole();
            }, 1000);
        }

        function stopBlackHoleFire() {
            clearInterval(blackHoleInterval);
            blackHoleInterval = null;
        }
        function startPunchFire() {
            if (punchInterval) return;
            punchInterval = setInterval(() => {
                if (shootingMode === 'punch') shootPunch();
            }, 200);
        }

        function stopPunchFire() {
            clearInterval(punchInterval);
            punchInterval = null;
        }

        // Kategori 2 ateş modları kontrol fonksiyonları
        function startEnergyFire() {
            if (energyInterval) return;
            energyInterval = setInterval(() => {
                if (shootingMode === 'energy') shootEnergy();
            }, 150);
        }
        function stopEnergyFire() {
            clearInterval(energyInterval);
            energyInterval = null;
        }
        function startLifestealerFire() {
            if (lifestealerInterval) return;
            lifestealerInterval = setInterval(() => {
                if (shootingMode === 'lifestealer') shootLifestealer();
            }, 250);
        }
        
        function stopLifestealerFire() {
            clearInterval(lifestealerInterval);
            lifestealerInterval = null;
        }
        function startFlamethrowerFire() {
            if (flamethrowerInterval) return;
            flamethrowerInterval = setInterval(() => {
                if (shootingMode === 'flamethrower') shootFlamethrower();
            }, 30);
        }
        function stopFlamethrowerFire() {
            clearInterval(flamethrowerInterval);
            flamethrowerInterval = null;
        }
        function startAcidSprayFire() {
            if (acidSprayInterval) return;
            acidSprayInterval = setInterval(() => {
                if (shootingMode === 'acidSpray') shootAcidSpray();
            }, 10);
        }
        function stopAcidSprayFire() {
            clearInterval(acidSprayInterval);
            acidSprayInterval = null;
        }
        function startDroneMissileFire() {
            if (droneMissileInterval) return;
            droneMissileInterval = setInterval(() => {
                if (shootingMode === 'droneMissile') shootDroneMissile();
            }, 500);
        }
        
        function stopDroneMissileFire() {
            if (droneMissileInterval) {
                clearInterval(droneMissileInterval);
                droneMissileInterval = null;
            }
        }
        function startMutationRayFire() {
            if (mutationRayInterval) return;
            mutationRayInterval = setInterval(() => {
                if (shootingMode === 'mutationRay') shootMutationRay();
            }, 200);
        }
        function stopMutationRayFire() {
            clearInterval(mutationRayInterval);
            mutationRayInterval = null;
        }
        // Füzyon şarj başlatma
function startFusionCharge() {
    if (!chargingFusion) {
        chargingFusion = true;
        fusionChargeStartTime = Date.now();
        
        // 4 saniye sonra otomatik ateşleme
        setTimeout(() => {
            if (chargingFusion) {
                shootFusion();
                chargingFusion = false;
            }
        }, maxFusionChargeTime);
    }
}

// Füzyon şarj bırakma
function stopFusionCharge() {
    if (chargingFusion) {
        shootFusion();
        chargingFusion = false;
        chargeParticles = []; // Partikülleri temizle
    }
}
function startLaserBeamFire() {
    if (laserBeamInterval) return;
    laserBeamInterval = setInterval(() => {
        if (shootingMode === 'laserBeam') shootLaserBeam();
    }, 20); // Her 200ms'de bir ateş et
}

// Durdurma fonksiyonu  
function stopLaserBeamFire() {
    if (laserBeamInterval) {
        clearInterval(laserBeamInterval);
        laserBeamInterval = null;
    }
}

function startExpRoundsFire() {
    if (expRoundsInterval) return;
    expRoundsInterval = setInterval(() => {
        if (shootingMode === 'expRounds') shootExpRounds();
    }, 800); // 0.5 saniyede bir ateş
}

function stopExpRoundsFire() {
    if (expRoundsInterval) {
        clearInterval(expRoundsInterval);
        expRoundsInterval = null;
    }
}
function startMinigunFire() {
    if (minigunInterval) return;
    minigunInterval = setInterval(() => {
        if (shootingMode === 'minigun') shootMinigun();
    }, 50); // Çok hızlı ateş etmesi için düşük interval
}

// Minigun durdurma fonksiyonu
function stopMinigunFire() {
    if (minigunInterval) {
        clearInterval(minigunInterval);
        minigunInterval = null;
    }
}
        // Oyun başlatma ve yeniden başlatma fonksiyonları
        function showDefeatScreen() {
            updateStats('game');
            document.getElementById("defeatScreen").style.display = "block";
            gameStarted = false;
        }
        function showVictoryScreen() {
            document.getElementById("victoryScreen").style.display = "block";
            gameStarted = false;
        }

        function restartGame() {
    // Mevcut istatistikleri kaydet 
    updateStats('game');
    
    // Oyunu sıfırla
    player = { x: 400, y: 500, width: 50, height: 50, health: 100 };
    enemies = [];
    bullets = [];
    bombs = [];
    health = 100;
    score = 0;
    level = 1;
    
    // Ekranları güncelle
    document.getElementById("defeatScreen").style.display = "none";
    document.getElementById("victoryScreen").style.display = "none";
    
    // Oyunu başlat
    gameStarted = true;
    gameLoop();
}

        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

function handleMouseDown(e) {
    if (e.button === 0) {
        if (shootingMode === 'fusion') {
            startFusionCharge();
        }
        startFiring();
    }
}

function handleMouseUp() {
    if (shootingMode === 'fusion') {
        stopFusionCharge();
    }
    stopFiring();
}

function startFiring() {
    switch(shootingMode) {
        case 'auto': startAutoFire(); break;
        case 'laser': startLaserFire(); break;
        case 'beam': startBeamFire(); break;
        case 'bomb': startBombFire(); break;
        case 'triple': startTripleFire(); break;
        case 'spread': startSpreadFire(); break;
        case 'lightning': startLightningFire(); break;
        case 'plasmaBall': startPlasmaBallFire(); break;
        case 'blackHole': startBlackHoleFire(); break;
        case 'energy': startEnergyFire(); break;
        case 'lifestealer': startLifestealerFire(); break;
        case 'flamethrower': startFlamethrowerFire(); break;
        case 'acidSpray': startAcidSprayFire(); break;
        case 'droneMissile': startDroneMissileFire(); break;
        case 'mutationRay': startMutationRayFire(); break;
        case 'laserBeam': startLaserBeamFire(); break;
        case 'expRounds': startExpRoundsFire(); break;
        case 'minigun': startMinigunFire(); break;
        case 'punch': startPunchFire(); break;
    }
}

function stopFiring() {
    stopAutoFire();
    stopLaserFire();
    stopBombFire();
    stopBeamFire();
    stopTripleFire();
    stopSpreadFire();
    stopLightningFire();
    stopPlasmaBallFire();
    stopBlackHoleFire();
    stopPunchFire();
    stopEnergyFire();
    stopLifestealerFire();
    stopFlamethrowerFire();
    stopAcidSprayFire();
    stopDroneMissileFire();
    stopMutationRayFire();
    stopLaserBeamFire();
    stopExpRoundsFire();
    stopMinigunFire();
    // Diğer ateş modlarının durdurma fonksiyonlarını da ekleyin
}

// Oyunu başlat
document.getElementById("startScreen").style.display = "block";
drawSoundBar();