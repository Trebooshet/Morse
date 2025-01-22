let input = document.getElementById('input');
let output = document.getElementById('output');
let translateButton = document.getElementById('translate_button');
let body = document.getElementById('body');
let index = 0;
let dotSound = new Audio('dot.mp3')
let dashSound = new Audio('dash.mp3')
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function readMorse(morseText) {
    if (index >= morseText.length) return; // Если дошли до конца текста

    const char = morseText[index];
    let delay = 0;

    if (char === '.') {
        body.style.backgroundImage = "url('2.jpg')";
        dotSound.play();
        delay = 200; // Пауза для точки
    } else if (char === '-') {
        body.style.backgroundImage = "url('2.jpg')";
        dashSound.play();
        delay = 600; // Пауза для тире
    } else if (char === ' ') {
        body.style.backgroundImage = "url('1.jpg')";
        delay = 1400; // Пауза для пробела
    }


    // Задержка
    await sleep(delay);

    

    // Обновление фона
    body.style.backgroundImage = "url('1.jpg')";
    
    index++; // Увеличиваем индекс

    // Запуск функции снова, но с задержкой между символами
    await sleep(200); // Ожидаем перед тем как вызвать следующий символ
    readMorse(morseText);
    
}
