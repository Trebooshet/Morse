let input = document.getElementById('input');
let output = document.getElementById('output');
let translateButton = document.getElementById('translate_button');
let body = document.getElementById('body');
let stopMorseReading = false;
let index = 0;
/*let dotSound = new Audio('5soundpip.mp3')
let dashSound = new Audio('3soundpip.mp3')*/
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const symbols = [
    {symbol: 'a', morseSymbol: '.-'},
    {symbol: 'b', morseSymbol: '-..'},
    {symbol: 'c', morseSymbol: '-.-.'},
    {symbol: 'd', morseSymbol: '-..'},
    {symbol: 'e', morseSymbol: '.'},
    {symbol: 'f', morseSymbol: '..-.'},
    {symbol: 'g', morseSymbol: '--.'},
    {symbol: 'h', morseSymbol: '....'},
    {symbol: 'i', morseSymbol: '..'},
    {symbol: 'j', morseSymbol: '.---'},
    {symbol: 'k', morseSymbol: '-.-'},
    {symbol: 'l', morseSymbol: '.-..'},
    {symbol: 'm', morseSymbol: '--'},
    {symbol: 'n', morseSymbol: '-.'},
    {symbol: 'o', morseSymbol: '---'},
    {symbol: 'p', morseSymbol: '.--.'},
    {symbol: 'q', morseSymbol: '--.-'},
    {symbol: 'r', morseSymbol: '.-.'},
    {symbol: 's', morseSymbol: '...'},
    {symbol: 't', morseSymbol: '-'},
    {symbol: 'u', morseSymbol: '..-'},
    {symbol: 'v', morseSymbol: '...-'},
    {symbol: 'w', morseSymbol: '.--'},
    {symbol: 'x', morseSymbol: '-..-'},
    {symbol: 'y', morseSymbol: '-.--'},
    {symbol: 'z', morseSymbol: '--..'},
    {symbol: '1', morseSymbol: '.----'},
    {symbol: '2', morseSymbol: '..---'},
    {symbol: '3', morseSymbol: '...--'},
    {symbol: '4', morseSymbol: '....-'},
    {symbol: '5', morseSymbol: '.....'},
    {symbol: '6', morseSymbol: '-....'},
    {symbol: '7', morseSymbol: '--...'},
    {symbol: '8', morseSymbol: '---..'},
    {symbol: '9', morseSymbol: '----.'},
    {symbol: '0', morseSymbol: '-----'},
    {symbol: ' ', morseSymbol: ' '},
 
];

input.addEventListener('keydown', function(event) {
   
    const allowedSymbols = symbols.map(item => item.symbol);

    if (allowedSymbols.includes(event.key) || allowedSymbols.includes(event.key.toUpperCase())) {
        input.value += event.key.toUpperCase();
        event.preventDefault();
    } else {
        event.preventDefault();
    }
     
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        translateButton.click()
    }
})

document.addEventListener('keydown', function(event) {
    if (event.key === 'Backspace') {
        input.value = input.value.substring(0, input.value.length - 1)
    }
})

translateButton.addEventListener('click', function()  {
    const inputText = input.value.toLowerCase();
    let morseText = '';
    

    for (const character of inputText) {
        const lowerCharacter = character.toLowerCase();
        const match = symbols.find(item => item.symbol === lowerCharacter);
        if (match) {
            morseText += match.morseSymbol + '\u00A0';
            
        } else {
            morseText += '';
        }
    }

    output.innerText = morseText;
    index = 0;
    input.focus();
    readMorse(morseText);

});

function playBeep(duration, frequency, volume) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Создаем аудиоконтекст
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.frequency.value = frequency; // Частота, например, 440 Гц
    oscillator.type = "sine"; // Тип волны (sine, square, triangle, sawtooth)
    gainNode.gain.value = volume; // Громкость

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    // Плавное затухание
    const currentTime = audioContext.currentTime;
    gainNode.gain.setValueAtTime(volume, currentTime); // Установить начальную громкость
    gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + duration / 1000); // Плавное затухание

    oscillator.stop(audioContext.currentTime + duration / 1000); // Остановить звук через duration в секундах
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

clearButton.addEventListener('click', function()  {
    input.value = '';
    output.innerText = '';
    input.focus();
    stopMorseReading = true;
})

async function readMorse(morseText) {
    
    if (stopMorseReading) {
        stopMorseReading = false;
        return; // Прекращаем выполнение функции
    }
    
    if (index >= morseText.length) return; // Если дошли до конца текста
   

    const char = morseText[index];
    let delay = 0;

    if (char === '.') {
        body.style.backgroundImage = "url('2.jpg')";
        playBeep(300, 528, 0.2);
     
        delay = 300; // Пауза для точки
    } else if (char === '-') {
        body.style.backgroundImage = "url('2.jpg')";
        playBeep(900, 528, 0.2);
      
        delay = 900; // Пауза для тире
    } else if (char === ' ') {
        body.style.backgroundImage = "url('1.jpg')";
        delay = 2100; // Пауза для пробела
    }


    // Задержка
    await sleep(delay);

    

    // Обновление фона
    body.style.backgroundImage = "url('1.jpg')";
    
    index++; // Увеличиваем индекс

    // Запуск функции снова, но с задержкой между символами
    await sleep(300); // Ожидаем перед тем как вызвать следующий символ
    readMorse(morseText);
    
}
