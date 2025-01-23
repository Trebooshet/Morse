let input = document.getElementById('input');
let output = document.getElementById('output');
let translateButton = document.getElementById('translate_button');
let clearButton = document.getElementById('clear_button');
let body = document.getElementById('body');
let currentReadingId = 0;

// Инициализация AudioContext для воспроизведения звука
let audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Символы и их представление в Морзе
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

// Функция воспроизведения звука
async function playSound(audioFile, duration) {
    const response = await fetch(audioFile);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);

    return new Promise((resolve) => {
        setTimeout(() => {
            source.stop();
            resolve();
        }, duration);
    });
}

// Функция воспроизведения Морзе
async function readMorse(morseText, readingId) {
    for (let i = 0; i < morseText.length; i++) {
        if (readingId !== currentReadingId) return;

        const char = morseText[i];

        if (char === '·') {
            body.style.backgroundImage = "url('22.jpg')";
            await playSound('dot3.mp3', 300); // Длительность точки
        } else if (char === '-') {
            body.style.backgroundImage = "url('22.jpg')";
            await playSound('dash3.mp3', 900); // Длительность тире
        } else if (char === ' ') {
            body.style.backgroundImage = "url('11.jpg')";
            await sleep(2100); // Длительность паузы между словами
        }

        body.style.backgroundImage = "url('11.jpg')"; // Возвращаем фон
        await sleep(300); // Пауза между символами
    }
}

// Функция задержки
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Обработчик ввода в поле
input.addEventListener('keydown', function (event) {
    const allowedSymbols = symbols.map(item => item.symbol);

    // Запрещаем ввод второго пробела подряд
    if (event.key === ' ' && input.value.endsWith(' ')) {
        event.preventDefault();
    }

    // Проверяем, если вводится символ, который разрешен
    else if (allowedSymbols.includes(event.key.toLowerCase())) {
        input.value += event.key.toUpperCase();
        event.preventDefault();
    } else {
        event.preventDefault(); // Запрещаем ввод других символов
    }
});

// Обработчик кнопки "Перевести"
translateButton.addEventListener('click', function () {
    const inputText = input.value.toLowerCase();
    let morseText = '';

    for (const character of inputText) {
        const match = symbols.find(item => item.symbol === character);
        morseText += match ? match.morseSymbol + '\u00A0' : '';
    }

    output.innerText = morseText.trim();
    input.focus();

    currentReadingId++;
    readMorse(morseText.trim(), currentReadingId);
});

// Обработчик кнопки "Очистить"
clearButton.addEventListener('click', function () {
    input.value = '';
    output.innerText = '';
    input.focus();
    currentReadingId++;
});

// Активация AudioContext при первом взаимодействии
document.addEventListener('click', () => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
});
