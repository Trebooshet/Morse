let input = document.getElementById('input');
let output = document.getElementById('output');
let translateButton = document.getElementById('translate_button');
let clearButton = document.getElementById('clear_button');
let body = document.getElementById('body');
let currentReadingId = 0;
let audioContext;
let isAudioInitialized = false;

let dotSound = document.getElementById('dotSound');
let dashSound = document.getElementById('dashSound');
/*
let dotSound = new Audio('dot3.mp3');
let dashSound = new Audio('dash3.mp3');*/

const symbols = [
    { symbol: 'a', morseSymbol: '·-' },
    { symbol: 'b', morseSymbol: '-···' },
    { symbol: 'c', morseSymbol: '-·-·' },
    { symbol: 'd', morseSymbol: '-·' },
    { symbol: 'e', morseSymbol: '·' },
    { symbol: 'f', morseSymbol: '··-·' },
    { symbol: 'g', morseSymbol: '--·' },
    { symbol: 'h', morseSymbol: '····' },
    { symbol: 'i', morseSymbol: '··' },
    { symbol: 'j', morseSymbol: '·---' },
    { symbol: 'k', morseSymbol: '-·-' },
    { symbol: 'l', morseSymbol: '·-··' },
    { symbol: 'm', morseSymbol: '--' },
    { symbol: 'n', morseSymbol: '-·' },
    { symbol: 'o', morseSymbol: '---' },
    { symbol: 'p', morseSymbol: '·--·' },
    { symbol: 'q', morseSymbol: '--·-' },
    { symbol: 'r', morseSymbol: '·-·' },
    { symbol: 's', morseSymbol: '···' },
    { symbol: 't', morseSymbol: '-' },
    { symbol: 'u', morseSymbol: '··-' },
    { symbol: 'v', morseSymbol: '···-' },
    { symbol: 'w', morseSymbol: '·--' },
    { symbol: 'x', morseSymbol: '-··-' },
    { symbol: 'y', morseSymbol: '-·--' },
    { symbol: 'z', morseSymbol: '--··' },
    { symbol: '1', morseSymbol: '·----' },
    { symbol: '2', morseSymbol: '··---' },
    { symbol: '3', morseSymbol: '···--' },
    { symbol: '4', morseSymbol: '····-' },
    { symbol: '5', morseSymbol: '·····' },
    { symbol: '6', morseSymbol: '-····' },
    { symbol: '7', morseSymbol: '--···' },
    { symbol: '8', morseSymbol: '---··' },
    { symbol: '9', morseSymbol: '----·' },
    { symbol: '0', morseSymbol: '-----' },
    { symbol: ' ', morseSymbol: ' ' },
    { symbol: 'а', morseSymbol: '·-' },
    { symbol: 'б', morseSymbol: '-···' },
    { symbol: 'в', morseSymbol: '·--' },
    { symbol: 'г', morseSymbol: '--·' },
    { symbol: 'д', morseSymbol: '-··' },
    { symbol: 'е', morseSymbol: '·' },
    { symbol: 'ж', morseSymbol: '···-' },
    { symbol: 'з', morseSymbol: '--··' },
    { symbol: 'и', morseSymbol: '··' },
    { symbol: 'й', morseSymbol: '·---' },
    { symbol: 'к', morseSymbol: '-·-' },
    { symbol: 'л', morseSymbol: '·-··' },
    { symbol: 'м', morseSymbol: '--' },
    { symbol: 'н', morseSymbol: '-·' },
    { symbol: 'о', morseSymbol: '---' },
    { symbol: 'п', morseSymbol: '·--·' },
    { symbol: 'р', morseSymbol: '·-·' },
    { symbol: 'с', morseSymbol: '···' },
    { symbol: 'т', morseSymbol: '-' },
    { symbol: 'у', morseSymbol: '··-' },
    { symbol: 'ф', morseSymbol: '··-·' },
    { symbol: 'х', morseSymbol: '····' },
    { symbol: 'ц', morseSymbol: '-·-·' },
    { symbol: 'ч', morseSymbol: '---·' },
    { symbol: 'ш', morseSymbol: '----' },
    { symbol: 'щ', morseSymbol: '--·-' },
    { symbol: 'ъ', morseSymbol: '--·--' },
    { symbol: 'ы', morseSymbol: '-·--' },
    { symbol: 'ь', morseSymbol: '-··-' },
    { symbol: 'э', morseSymbol: '··-··' },
    { symbol: 'ю', morseSymbol: '··--' },
    { symbol: 'я', morseSymbol: '·-·-' },

];

input.addEventListener('keydown', function (event) {
    const allowedSymbols = symbols.map(item => item.symbol);

    

    // Запрещаем ввод второго пробела подряд
    if (event.key === ' ' && input.value.endsWith(' ')) {
        event.preventDefault();
        input.value = input.value.replace('.', '');
    }

    // Проверяем, если вводится разрешённый символ
    else if (allowedSymbols.includes(event.key.toLowerCase())) {
        input.value += event.key.toUpperCase();
        event.preventDefault();
    } else {
        event.preventDefault(); // Запрещаем ввод других символов
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        translateButton.click();
    }
});

document.addEventListener('keydown', function (event) {
    if (event.key === 'Backspace') {
        input.value = input.value.substring(0, input.value.length - 1);
    }
});

translateButton.addEventListener('click', function () {
    initializeAudioContext();
    const inputText = input.value.toLowerCase();
    let morseText = '';

    for (const character of inputText) {
        const match = symbols.find(item => item.symbol === character);
        morseText += match ? match.morseSymbol + '\u00A0' : '';
    }

    output.innerText = morseText.trim();
    input.blur();

    currentReadingId++;
    readMorse(morseText.trim(), currentReadingId);
});

clearButton.addEventListener('click', function () {
    initializeAudioContext();
    input.value = '';
    output.innerText = '';
    input.focus();
    currentReadingId++;
});

async function readMorse(morseText, readingId) {
    const words = morseText.split('   '); // Разделяем слова (3 пробела между словами)

    for (const word of words) {
        if (readingId !== currentReadingId) return;

        const letters = word.split(' '); // Разделяем буквы (1 пробел между буквами)

        for (const letter of letters) {
            if (readingId !== currentReadingId) return;

            for (let i = 0; i < letter.length; i++) {
                const char = letter[i];
                if (readingId !== currentReadingId) return;

                if (char === '·') {
                    body.style.backgroundImage = "url('22.jpg')";
                    await playSound(dotSound, 300); // Длительность точки
                } else if (char === '-') {
                    body.style.backgroundImage = "url('22.jpg')";
                    await playSound(dashSound, 900); // Длительность тире
                }

                body.style.backgroundImage = "url('11.jpg')"; // Возвращаем фон

                // Пауза между символами (кроме последнего в букве)
                if (i < letter.length - 1) {
                    await sleep(300); // Пауза между символами
                }
            }

            // Пауза между буквами
            await sleep(900);
        }

        // Пауза между словами
        await sleep(2100);
    }
}

function playSound(sound, duration) {
    return new Promise((resolve) => {
        sound.currentTime = 0;
        sound.play();
        setTimeout(() => {
            sound.pause();
            resolve();
        }, duration);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



function initializeAudioContext() {
    if (!isAudioInitialized) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        isAudioInitialized = true;
    }
}

