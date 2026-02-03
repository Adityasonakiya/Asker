// Initialize configuration
const config = window.VALENTINE_CONFIG;
let sadCard = null;


const sadMedia = [
    { type: "img", src: "./assets/2.jpeg" },
    { type: "img", src: "./assets/1.jpeg" },
    { type: "img", src: "./assets/3.jpeg" },
    { type: "img", src: "./assets/4.jpeg" },
    { type: "img", src: "./assets/5.jpeg" },
    { type: "img", src: "./assets/6.jpeg" },
    { type: "img", src: "./assets/8.jpeg" },
    { type: "img", src: "./assets/7.jpeg" },
    { type: "video", src: "./assets/v3.mp4" }, 
    { type: "img", src: "./assets/10.jpeg" },
    { type: "img", src: "./assets/11.jpeg" },
    { type: "img", src: "./assets/9.jpeg" },
    { type: "video", src: "./assets/v5.mp4" },
    { type: "video", src: "./assets/v1.mp4" } // 👈 LAST ONE
];

function createSadCard() {
    if (sadCard) return sadCard;

    const card = document.createElement("div");
    card.id = "sadMediaCard";

    card.style.position = "fixed";
    card.style.top = "30px";
    card.style.left = "50%";
    card.style.transform = "translateX(-50%)";
    card.style.width = "220px";
    card.style.height = "260px";
    card.style.background = "white";
    card.style.borderRadius = "16px";
    card.style.boxShadow = "0 15px 40px rgba(0,0,0,0.25)";
    card.style.display = "flex";
    card.style.alignItems = "center";
    card.style.justifyContent = "center";
    card.style.zIndex = "9999";
    card.style.overflow = "hidden";
    card.style.transition = "opacity 0.4s ease, transform 0.4s ease";

    document.body.appendChild(card);
    sadCard = card;
    return card;
}


function handleFinalNo() {
    const noBtn = document.getElementById("noBtn3");
    const yesBtn = document.getElementById("yesBtn3");

    // 👉 Update NO text
    if (noClickCount < noPhrases.length - 1) {
        noBtn.textContent = noPhrases[noClickCount + 1];
    } else {
        noBtn.textContent = noPhrases[noPhrases.length - 1];
    }

    // 👉 Show ONE sad media per click
    showSadMedia(noClickCount);

    // 👉 Grow YES button
    const currentScale = yesBtn.dataset.scale
        ? parseFloat(yesBtn.dataset.scale)
        : 1;

    const newScale = currentScale + 0.05;
    yesBtn.style.transform = `scale(${newScale})`;
    yesBtn.dataset.scale = newScale;

    // 👉 Increment at END
    noClickCount++;
}

    function showSadMedia(index) {
        const card = createSadCard();

        const media =
            index < sadMedia.length
                ? sadMedia[index]
                : sadMedia[sadMedia.length - 1];

        // Clear previous media
        card.innerHTML = "";

        let el;

        if (media.type === "img") {
            el = document.createElement("img");
            el.src = media.src;
        } else {
            el = document.createElement("video");
            el.src = media.src;
            el.autoplay = true;
            el.muted = true;
            el.loop = true;
            el.playsInline = true;
        }

    // 🔒 SAME SIZE FOR ALL MEDIA
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.objectFit = "cover";
    el.style.borderRadius = "16px";

    card.appendChild(el);

    // Soft entrance animation
    card.style.opacity = "0";
    card.style.transform = "translateX(-50%) scale(0.9)";
    setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateX(-50%) scale(1)";
    }, 50);
}

function removeSadCard() {
    if (!sadCard) return;

    // Stop video if playing
    const video = sadCard.querySelector("video");
    if (video) {
        video.pause();
        video.currentTime = 0;
    }

    // Fade out + remove
    sadCard.style.opacity = "0";
    sadCard.style.transform = "translateX(-50%) scale(0.9)";

    setTimeout(() => {
        sadCard.remove();
        sadCard = null;
    }, 300);
}


function showYesImage() {
    const img = document.createElement("img");
    img.src = "./assets/thanks.jpeg";
    img.alt = "happy";

    img.style.position = "fixed";
    img.style.top = "50%";
    img.style.left = "50%";
    img.style.transform = "translate(-50%, -50%) scale(1)";
    img.style.width = "200px";
    img.style.borderRadius = "16px";
    img.style.zIndex = "10000";
    img.style.boxShadow = "0 15px 40px rgba(0,0,0,0.3)";
    img.style.transition = "opacity 0.5s ease";

    document.body.appendChild(img);

    setTimeout(() => {
        img.style.opacity = "0";
        setTimeout(() => img.remove(), 500);
    }, 1500);
}

document.getElementById("yesBtn3").addEventListener("click", () => {
    removeSadCard();   // 👈 removes last sad image/video
    showYesImage();    // 👈 your happy image
    celebrate();       // 👈 optional if already wired
});




// Validate configuration
function validateConfig() {
    const warnings = [];

    // Check required fields
    if (!config.valentineName) {
        warnings.push("Valentine's name is not set! Using default.");
        config.valentineName = "My Love";
    }

    // Validate colors
    const isValidHex = (hex) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    Object.entries(config.colors).forEach(([key, value]) => {
        if (!isValidHex(value)) {
            warnings.push(`Invalid color for ${key}! Using default.`);
            config.colors[key] = getDefaultColor(key);
        }
    });

    // Validate animation values
    if (parseFloat(config.animations.floatDuration) < 5) {
        warnings.push("Float duration too short! Setting to 5s minimum.");
        config.animations.floatDuration = "5s";
    }

    if (config.animations.heartExplosionSize < 1 || config.animations.heartExplosionSize > 3) {
        warnings.push("Heart explosion size should be between 1 and 3! Using default.");
        config.animations.heartExplosionSize = 1.5;
    }

    // Log warnings if any
    if (warnings.length > 0) {
        console.warn("⚠️ Configuration Warnings:");
        warnings.forEach(warning => console.warn("- " + warning));
    }
}

// Default color values
function getDefaultColor(key) {
    const defaults = {
        backgroundStart: "#ffafbd",
        backgroundEnd: "#ffc3a0",
        buttonBackground: "#ff6b6b",
        buttonHover: "#ff8787",
        textColor: "#ff4757"
    };
    return defaults[key];
}

// Set page title
document.title = config.pageTitle;

// Initialize the page content when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    // Validate configuration first
    validateConfig();

    // Set texts from config
    document.getElementById('valentineTitle').textContent = `${config.valentineName} Sharma`;

    // Set first question texts
    document.getElementById('question1Text').textContent = config.questions.first.text;
    document.getElementById('yesBtn1').textContent = config.questions.first.yesBtn;
    document.getElementById('noBtn1').textContent = config.questions.first.noBtn;
    document.getElementById('secretAnswerBtn').textContent = config.questions.first.secretAnswer;

    // Set second question texts
    document.getElementById('question2Text').textContent = config.questions.second.text;
    document.getElementById('startText').textContent = config.questions.second.startText;
    document.getElementById('nextBtn').textContent = config.questions.second.nextBtn;

    // Set third question texts
    document.getElementById('question3Text').textContent = config.questions.third.text;
    document.getElementById('yesBtn3').textContent = config.questions.third.yesBtn;
    document.getElementById('noBtn3').textContent = config.questions.third.noBtn;

    // Create initial floating elements
    createFloatingElements();

    // Setup music player
    setupMusicPlayer();
});

// Create floating hearts and bears
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');

    // Create hearts
    config.floatingEmojis.hearts.forEach(heart => {
        const div = document.createElement('div');
        div.className = 'heart';
        div.innerHTML = heart;
        setRandomPosition(div);
        container.appendChild(div);
    });

    // Create bears
    config.floatingEmojis.bears.forEach(bear => {
        const div = document.createElement('div');
        div.className = 'bear';
        div.innerHTML = bear;
        setRandomPosition(div);
        container.appendChild(div);
    });
}

// Set random position for floating elements
function setRandomPosition(element) {
    element.style.left = Math.random() * 100 + 'vw';
    element.style.animationDelay = Math.random() * 5 + 's';
    element.style.animationDuration = 10 + Math.random() * 20 + 's';
}

// Function to show next question
function showNextQuestion(questionNumber) {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    document.getElementById(`question${questionNumber}`).classList.remove('hidden');
}

// Function to move the "No" button when clicked
function moveButton(button) {
    const x = Math.random() * (window.innerWidth - button.offsetWidth);
    const y = Math.random() * (window.innerHeight - button.offsetHeight);
    button.style.position = 'fixed';
    button.style.left = x + 'px';
    button.style.top = y + 'px';
}

// Love meter functionality
const loveMeter = document.getElementById('loveMeter');
const loveValue = document.getElementById('loveValue');
const extraLove = document.getElementById('extraLove');

function setInitialPosition() {
    loveMeter.value = 100;
    loveValue.textContent = 100;
    loveMeter.style.width = '100%';
}

loveMeter.addEventListener('input', () => {
    const value = parseInt(loveMeter.value);
    loveValue.textContent = value;

    if (value > 100) {
        extraLove.classList.remove('hidden');
        const overflowPercentage = (value - 100) / 9900;
        const extraWidth = overflowPercentage * window.innerWidth * 0.8;
        loveMeter.style.width = `calc(100% + ${extraWidth}px)`;
        loveMeter.style.transition = 'width 0.3s';

        // Show different messages based on the value
        if (value >= 5000) {
            extraLove.classList.add('super-love');
            extraLove.textContent = config.loveMessages.extreme;
        } else if (value > 1000) {
            extraLove.classList.remove('super-love');
            extraLove.textContent = config.loveMessages.high;
        } else {
            extraLove.classList.remove('super-love');
            extraLove.textContent = config.loveMessages.normal;
        }
    } else {
        extraLove.classList.add('hidden');
        extraLove.classList.remove('super-love');
        loveMeter.style.width = '100%';
    }
});

// Initialize love meter
window.addEventListener('DOMContentLoaded', setInitialPosition);
window.addEventListener('load', setInitialPosition);

// Celebration function
function celebrate() {
    document.querySelectorAll('.question-section').forEach(q => q.classList.add('hidden'));
    const celebration = document.getElementById('celebration');
    celebration.classList.remove('hidden');

    // Set celebration messages
    document.getElementById('celebrationTitle').textContent = config.celebration.title;
    document.getElementById('celebrationMessage').textContent = config.celebration.message;
    document.getElementById('celebrationEmojis').textContent = config.celebration.emojis;

    // Create heart explosion effect
    createHeartExplosion();
}

// Create heart explosion animation
function createHeartExplosion() {
    for (let i = 0; i < 50; i++) {
        const heart = document.createElement('div');
        const randomHeart = config.floatingEmojis.hearts[Math.floor(Math.random() * config.floatingEmojis.hearts.length)];
        heart.innerHTML = randomHeart;
        heart.className = 'heart';
        document.querySelector('.floating-elements').appendChild(heart);
        setRandomPosition(heart);
    }
}

// Music Player Setup
function setupMusicPlayer() {
    const musicControls = document.getElementById('musicControls');
    const musicToggle = document.getElementById('musicToggle');
    const bgMusic = document.getElementById('bgMusic');
    const musicSource = document.getElementById('musicSource');

    // Only show controls if music is enabled in config
    if (!config.music.enabled) {
        musicControls.style.display = 'none';
        return;
    }

    // Set music source and volume
    musicSource.src = config.music.musicUrl;
    bgMusic.volume = config.music.volume || 0.5;
    bgMusic.load();

    // Try autoplay if enabled
    if (config.music.autoplay) {
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Autoplay prevented by browser");
                musicToggle.textContent = config.music.startText;
            });
        }
    }

    // Toggle music on button click
    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.textContent = config.music.stopText;
        } else {
            bgMusic.pause();
            musicToggle.textContent = config.music.startText;
        }
    });
} 