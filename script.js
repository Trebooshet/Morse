let input = document.getElementById('input');
let output = document.getElementById('output');
let translateButton = document.getElementById('translate_button');
let clearButton = document.getElementById('clear_button');
let body = document.getElementById('body');
let currentReadingId = 0;
let audioContext;
let isAudioInitialized = false;



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
    { symbol: ' ', morseSymbol: ' ' }
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
                    await playSound(440, 300, 0.3); // Точка: частота 528 Гц, длительность 300 мс
                } else if (char === '-') {
                    body.style.backgroundImage = "url('22.jpg')";
                    await playSound(440, 900, 0.3); // Тире: частота 528 Гц, длительность 900 мс
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

function playSound(frequency, duration, volume = 0.3) {
    return new Promise((resolve) => {
        const oscillator = audioContext.createOscillator(); // Создаем генератор звука
        const gainNode = audioContext.createGain(); // Создаем узел громкости

        oscillator.type = 'sine'; // Тип волны: синусоидальная
        oscillator.frequency.value = frequency; // Частота звука

        gainNode.gain.value = volume; // Громкость

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();

        setTimeout(() => {
            oscillator.stop(); // Останавливаем генератор звука
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

