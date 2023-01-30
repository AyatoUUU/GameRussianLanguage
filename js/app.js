(() => {
    "use strict";
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    class DynamicAdapt {
        constructor(type) {
            this.type = type;
        }
        init() {
            this.оbjects = [];
            this.daClassname = "_dynamic_adapt_";
            this.nodes = [ ...document.querySelectorAll("[data-da]") ];
            this.nodes.forEach((node => {
                const data = node.dataset.da.trim();
                const dataArray = data.split(",");
                const оbject = {};
                оbject.element = node;
                оbject.parent = node.parentNode;
                оbject.destination = document.querySelector(`${dataArray[0].trim()}`);
                оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
                оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
                оbject.index = this.indexInParent(оbject.parent, оbject.element);
                this.оbjects.push(оbject);
            }));
            this.arraySort(this.оbjects);
            this.mediaQueries = this.оbjects.map((({breakpoint}) => `(${this.type}-width: ${breakpoint}px),${breakpoint}`)).filter(((item, index, self) => self.indexOf(item) === index));
            this.mediaQueries.forEach((media => {
                const mediaSplit = media.split(",");
                const matchMedia = window.matchMedia(mediaSplit[0]);
                const mediaBreakpoint = mediaSplit[1];
                const оbjectsFilter = this.оbjects.filter((({breakpoint}) => breakpoint === mediaBreakpoint));
                matchMedia.addEventListener("change", (() => {
                    this.mediaHandler(matchMedia, оbjectsFilter);
                }));
                this.mediaHandler(matchMedia, оbjectsFilter);
            }));
        }
        mediaHandler(matchMedia, оbjects) {
            if (matchMedia.matches) оbjects.forEach((оbject => {
                this.moveTo(оbject.place, оbject.element, оbject.destination);
            })); else оbjects.forEach((({parent, element, index}) => {
                if (element.classList.contains(this.daClassname)) this.moveBack(parent, element, index);
            }));
        }
        moveTo(place, element, destination) {
            element.classList.add(this.daClassname);
            if ("last" === place || place >= destination.children.length) {
                destination.append(element);
                return;
            }
            if ("first" === place) {
                destination.prepend(element);
                return;
            }
            destination.children[place].before(element);
        }
        moveBack(parent, element, index) {
            element.classList.remove(this.daClassname);
            if (void 0 !== parent.children[index]) parent.children[index].before(element); else parent.append(element);
        }
        indexInParent(parent, element) {
            return [ ...parent.children ].indexOf(element);
        }
        arraySort(arr) {
            if ("min" === this.type) arr.sort(((a, b) => {
                if (a.breakpoint === b.breakpoint) {
                    if (a.place === b.place) return 0;
                    if ("first" === a.place || "last" === b.place) return -1;
                    if ("last" === a.place || "first" === b.place) return 1;
                    return 0;
                }
                return a.breakpoint - b.breakpoint;
            })); else {
                arr.sort(((a, b) => {
                    if (a.breakpoint === b.breakpoint) {
                        if (a.place === b.place) return 0;
                        if ("first" === a.place || "last" === b.place) return 1;
                        if ("last" === a.place || "first" === b.place) return -1;
                        return 0;
                    }
                    return b.breakpoint - a.breakpoint;
                }));
                return;
            }
        }
    }
    const da = new DynamicAdapt("max");
    da.init();
    const buttonRepeatGame = document.getElementById("buttonRepeatGame");
    const modelWindow = document.getElementById("modelWindow");
    const documentBody = document.querySelector(".body");
    const gameStartWindow = document.querySelector(".game__start-window");
    const canvas = document.querySelector(".game__canvas");
    const gameTaskBlock = document.querySelector(".game__task-block");
    const gameActions = document.querySelector(".game__actions");
    const checkUserAnswerBtn = document.getElementById("checkUserAnswerBtn");
    let wordsCollection = [ "модник", "легкий", "почему", "трость", "фигура", "шифр", "нос", "мир", "сон", "снег", "смех", "жук", "куб", "рис", "рак", "уют", "фея" ];
    let randomWord;
    let randomWordLettersArray;
    let Letterbuttons = document.getElementsByClassName("letter");
    let lettersObjectsArray = [];
    let progress = 0;
    const audioObject = {
        clickSound: new Audio("../img/audio/clickBtnSound.wav")
    };
    getRandomWords();
    function getRandomWords() {
        randomWord = wordsCollection[Math.floor(Math.random() * wordsCollection.length)];
        wordsCollection = wordsCollection.filter((word => word !== randomWord));
        randomWordLettersArray = randomWord.split("");
        let html = "";
        for (let i = 0; i < randomWordLettersArray.length; i++) html += `<button type='button' class='letter'>${randomWordLettersArray[i]}</button>`;
        gameTaskBlock.innerHTML = html;
        for (let i = 0; i < randomWordLettersArray.length; i++) {
            if ("а" == randomWordLettersArray[i] || "у" == randomWordLettersArray[i] || "о" == randomWordLettersArray[i] || "ы" == randomWordLettersArray[i] || "э" == randomWordLettersArray[i] || "я" == randomWordLettersArray[i] || "ю" == randomWordLettersArray[i] || "ё" == randomWordLettersArray[i] || "и" == randomWordLettersArray[i] || "е" == randomWordLettersArray[i]) lettersObjectsArray.push({
                letter: randomWordLettersArray[i],
                sound: "vowe",
                userAnswer: void 0
            });
            if ("б" == randomWordLettersArray[i] || "в" == randomWordLettersArray[i] || "г" == randomWordLettersArray[i] || "д" == randomWordLettersArray[i] || "ж" == randomWordLettersArray[i] || "з" == randomWordLettersArray[i] || "й" == randomWordLettersArray[i] || "к" == randomWordLettersArray[i] || "л" == randomWordLettersArray[i] || "м" == randomWordLettersArray[i] || "н" == randomWordLettersArray[i] || "п" == randomWordLettersArray[i] || "р" == randomWordLettersArray[i] || "с" == randomWordLettersArray[i] || "т" == randomWordLettersArray[i] || "ф" == randomWordLettersArray[i] || "х" == randomWordLettersArray[i] || "ц" == randomWordLettersArray[i] || "ч" == randomWordLettersArray[i] || "ш" == randomWordLettersArray[i] || "щ" == randomWordLettersArray[i] || "ъ" == randomWordLettersArray[i] || "ь" == randomWordLettersArray[i]) lettersObjectsArray.push({
                letter: randomWordLettersArray[i],
                sound: "consonant",
                userAnswer: void 0
            });
        }
    }
    function loopThroughButtons() {
        Letterbuttons = document.getElementsByClassName("letter");
        for (let i = 0; i < Letterbuttons.length; i++) {
            let letterButton = Letterbuttons[i];
            let clicked = false;
            letterButton.addEventListener("click", (function() {
                audioObject.clickSound.play();
                if (false === clicked) {
                    clicked = true;
                    letterButton.style.color = "#FF003D";
                    lettersObjectsArray.forEach((letterObjectsArray => {
                        if (letterObjectsArray.letter == letterButton.textContent) letterObjectsArray.userAnswer = "vowe";
                    }));
                } else {
                    clicked = false;
                    letterButton.style.color = "#9747FF";
                    lettersObjectsArray.forEach((letterObjectsArray => {
                        if (letterObjectsArray.letter == letterButton.textContent) letterObjectsArray.userAnswer = "consonant";
                    }));
                }
            }));
        }
    }
    let trueAnswer = 0;
    checkUserAnswerBtn.addEventListener("click", (function() {
        audioObject.clickSound.play();
        lettersObjectsArray.forEach((letterObjectsArray => {
            if (letterObjectsArray.userAnswer == letterObjectsArray.sound) trueAnswer++;
        }));
        if (lettersObjectsArray.length == trueAnswer) {
            progressGame();
            lettersObjectsArray = [];
            getRandomWords();
            loopThroughButtons();
            trueAnswer = 0;
        }
    }));
    function progressGame() {
        ++progress;
        if (10 == progress) endGame();
    }
    function startGame() {
        interval = setInterval(startTime, 10);
        loopThroughButtons();
    }
    function endGame() {
        startConfetti();
        showModelWindow();
        clearInterval(interval);
    }
    function repeatGame() {
        progress = 0;
        removeConfetti();
        removeModelWindow();
        milli = 0;
        seconds = 0;
        minutes = 0;
        getSeconds.innerText = "00";
        getMinutes.innerText = "00";
        interval = setInterval(startTime, 10);
    }
    buttonRepeatGame.addEventListener("click", (function(e) {
        repeatGame();
    }));
    function showModelWindow() {
        modelWindow.classList.add("show-model");
        documentBody.classList.add("locked");
    }
    function removeModelWindow() {
        modelWindow.classList.remove("show-model");
        documentBody.classList.remove("locked");
    }
    window.addEventListener("load", (function() {
        gameStartWindow.innerHTML = '<button id="startGameBtn">Начать игру</button>';
        const startGameBtn = document.getElementById("startGameBtn");
        startGameBtn.addEventListener("click", (function() {
            canvas.style.filter = "none";
            canvas.style.mixBlendMode = "normal";
            startGameBtn.style.display = "none";
            audioObject.clickSound.play();
            gameStartWindow.style.display = "none";
            gameActions.style.display = "inline-flex";
            checkUserAnswerBtn.style.display = "inline-flex";
            startGame();
        }));
    }));
    const getSeconds = document.querySelector(".seconds");
    const getMinutes = document.querySelector(".minutes");
    let milli = 0;
    let seconds = 0;
    let minutes = 0;
    let interval;
    function startTime() {
        milli++;
        if (milli > 99) {
            seconds++;
            getSeconds.innerText = "0" + seconds;
            milli = 0;
        }
        if (seconds > 9) getSeconds.innerText = seconds;
        if (seconds > 59) {
            minutes++;
            getMinutes.innerText = "0" + minutes;
            seconds = 0;
            getSeconds.innerText = "0" + 0;
        }
        if (minutes > 9) getMinutes.innerText = minutes;
    }
    let maxParticleCount = 150;
    let particleSpeed = 2;
    let startConfetti;
    let stopConfetti;
    let toggleConfetti;
    let removeConfetti;
    (function() {
        startConfetti = startConfettiInner;
        stopConfetti = stopConfettiInner;
        toggleConfetti = toggleConfettiInner;
        removeConfetti = removeConfettiInner;
        let colors = [ "DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson" ];
        let streamingConfetti = false;
        let animationTimer = null;
        let particles = [];
        let waveAngle = 0;
        function resetParticle(particle, width, height) {
            particle.color = colors[Math.random() * colors.length | 0];
            particle.x = Math.random() * width;
            particle.y = Math.random() * height - height;
            particle.diameter = 10 * Math.random() + 5;
            particle.tilt = 10 * Math.random() - 10;
            particle.tiltAngleIncrement = .07 * Math.random() + .05;
            particle.tiltAngle = 0;
            return particle;
        }
        function startConfettiInner() {
            var width = window.innerWidth;
            var height = window.innerHeight;
            window.requestAnimFrame = function() {
                return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                    return window.setTimeout(callback, 16.6666667);
                };
            }();
            let canvas = document.getElementById("confetti-canvas");
            if (null === canvas) {
                canvas = document.createElement("canvas");
                canvas.setAttribute("id", "confetti-canvas");
                canvas.setAttribute("style", "display:block;z-index:999999;pointer-events:none;position:absolute;");
                document.body.prepend(canvas);
                canvas.width = width;
                canvas.height = height;
                window.addEventListener("resize", (function() {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                }), true);
            }
            let context = canvas.getContext("2d");
            while (particles.length < maxParticleCount) particles.push(resetParticle({}, width, height));
            streamingConfetti = true;
            if (null === animationTimer) (function runAnimation() {
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);
                if (0 === particles.length) animationTimer = null; else {
                    updateParticles();
                    drawParticles(context);
                    animationTimer = requestAnimFrame(runAnimation);
                }
            })();
        }
        function stopConfettiInner() {
            streamingConfetti = false;
        }
        function removeConfettiInner() {
            stopConfetti();
            particles = [];
        }
        function toggleConfettiInner() {
            if (streamingConfetti) stopConfettiInner(); else startConfettiInner();
        }
        function drawParticles(context) {
            let particle;
            let x;
            for (var i = 0; i < particles.length; i++) {
                particle = particles[i];
                context.beginPath();
                context.lineWidth = particle.diameter;
                context.strokeStyle = particle.color;
                x = particle.x + particle.tilt;
                context.moveTo(x + particle.diameter / 2, particle.y);
                context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
                context.stroke();
            }
        }
        function updateParticles() {
            let width = window.innerWidth;
            let height = window.innerHeight;
            let particle;
            waveAngle += .01;
            for (let i = 0; i < particles.length; i++) {
                particle = particles[i];
                if (!streamingConfetti && particle.y < -15) particle.y = height + 100; else {
                    particle.tiltAngle += particle.tiltAngleIncrement;
                    particle.x += Math.sin(waveAngle);
                    particle.y += .5 * (Math.cos(waveAngle) + particle.diameter + particleSpeed);
                    particle.tilt = 15 * Math.sin(particle.tiltAngle);
                }
                if (particle.x > width + 20 || particle.x < -20 || particle.y > height) if (streamingConfetti && particles.length <= maxParticleCount) resetParticle(particle, width, height); else {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }
    })();
    window["FLS"] = true;
})();