// --- PASO 1: CÓDIGO DEL CONTADOR REGRESIVO ---

// Buscamos en el HTML el elemento que tiene el id="countdown"
const countdownEl = document.getElementById('countdown');

// Configuramos la fecha de finalización (calcula automáticamente el último día del mes actual)
const hoy = new Date();
const finDeMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59); // Pone la hora a las 23:59:59 del último día del mes

// Esta función se ejecutará cada segundo para actualizar el contador
const intervalo = setInterval(() => {
    // Obtenemos la fecha y hora actual en cada segundo
    const ahora = new Date().getTime();

    // Calculamos la distancia entre el fin de mes y el ahora
    const distancia = finDeMes.getTime() - ahora;

    // Si el tiempo ya pasó, detenemos el contador
    if (distancia < 0) {
        clearInterval(intervalo);
        countdownEl.innerHTML = "¡RONDA CERRADA!";
        return;
    }

    // Cálculos matemáticos para obtener días, horas, minutos y segundos
    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    // Mostramos el resultado en nuestro elemento HTML
    countdownEl.innerHTML = `${dias}d ${horas}h ${minutos}m ${segundos}s`;

}, 1000);

// --- PASO 2: CÓDIGO DEL PRECIO DE BTC ---

// Buscamos el elemento HTML con el id="btc-price"
const btcPriceEl = document.getElementById('btc-price');

// Creamos una función para obtener el precio.
async function fetchBtcPrice() {
    try {
        // Hacemos la llamada a la API de CoinGecko y esperamos la respuesta
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        
        // Convertimos la respuesta en un formato que JavaScript pueda usar (JSON)
        const data = await response.json();
        
        // Obtenemos el precio en USD y le damos un formato bonito (con comas)
        const formattedPrice = data.bitcoin.usd.toLocaleString('en-US');

        // Actualizamos el contenido del elemento HTML con el precio
        btcPriceEl.innerHTML = `$${formattedPrice}`;

    } catch (error) {
        // Si algo falla, mostramos un error en la consola
        console.error("Error al obtener el precio de BTC:", error);
        btcPriceEl.innerHTML = 'Error';
    }
}

// Llamamos a la función una vez para que se ejecute en cuanto cargue la página
fetchBtcPrice();

// Además, configuramos un intervalo para que la función se vuelva a ejecutar cada 60 segundos
setInterval(fetchBtcPrice, 60000);

// --- PASO 3: CÓDIGO DEL BOTE ACTUAL (VERSIÓN API) ---

const potValueEl = document.getElementById('pot-value');

async function fetchPotBalance() {
    try {
        // !! CAMBIA ESTA URL POR LA URL DE TU NUEVO WORKER !!
        const workerUrl = 'https://solitary-wildflower-a068.arielbcb.workers.dev/';
        
        const response = await fetch(workerUrl);
        const data = await response.json();

        const formattedPot = data.balance.toLocaleString('en-US');
        potValueEl.innerHTML = `${formattedPot} Satoshis`;

    } catch (error) {
        console.error("Error al obtener el saldo del bote:", error);
        potValueEl.innerHTML = 'Error';
    }
}

// Llamamos a la función al cargar la página y luego cada 2 minutos
fetchPotBalance();
setInterval(fetchPotBalance, 120000); // Actualiza cada 2 minutos
