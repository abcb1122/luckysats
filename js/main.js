// --- PASO 1: CÓDIGO DEL CONTADOR REGRESIVO ---

const countdownEl = document.getElementById('countdown');
const hoy = new Date();
const finDeMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59);

const intervalo = setInterval(() => {
    const ahora = new Date().getTime();
    const distancia = finDeMes.getTime() - ahora;

    if (distancia < 0) {
        clearInterval(intervalo);
        countdownEl.innerHTML = "¡RONDA CERRADA!";
        return;
    }

    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    countdownEl.innerHTML = `${dias}d ${horas}h ${minutos}m ${segundos}s`;
}, 1000);


// --- PASO 2: CÓDIGO DEL PRECIO DE BTC ---

const btcPriceEl = document.getElementById('btc-price');

async function fetchBtcPrice() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const data = await response.json();
        const formattedPrice = data.bitcoin.usd.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
        btcPriceEl.innerHTML = formattedPrice;
    } catch (error) {
        console.error("Error al obtener el precio de BTC:", error);
        btcPriceEl.innerHTML = 'Error';
    }
}
fetchBtcPrice();
setInterval(fetchBtcPrice, 60000);


// --- PASO 3: CÓDIGO DEL BOTE Y DATOS DE CONFIGURACIÓN ---

const potValueEl = document.getElementById('pot-value');
const lastMonthPriceEl = document.getElementById('last-month-price');
const priceSourceLinkEl = document.getElementById('price-source-link');

async function fetchConfigData() {
    try {
        // Obtenemos datos de nuestro worker (para el bote)
        const workerUrl = 'https://solitary-wildflower-a068.arielbcb.workers.dev/';
        const potResponse = await fetch(workerUrl);
        const potData = await potResponse.json();
        const formattedPot = potData.balance.toLocaleString('en-US');
        potValueEl.innerHTML = `${formattedPot} Satoshis`;

        // Obtenemos datos de nuestro archivo config.json (para datos históricos)
        // NOTA: Para este ejemplo, estamos simulando los datos históricos.
        // En un futuro, estos podrían venir de otra API.
        // Por ahora, vamos a hardcodearlos aquí para que sea más fácil.
        const lastMonthData = {
            name: "Mayo 2025",
            closingPrice: "$102,500",
            sourceName: "Kraken",
            sourceURL: "https://www.kraken.com/prices/btc-bitcoin-price-chart/usd-us-dollar"
        };

        const formattedLastPrice = lastMonthData.closingPrice;
        lastMonthPriceEl.innerHTML = formattedLastPrice;
        
        // Actualizamos el enlace de la fuente
        priceSourceLinkEl.href = lastMonthData.sourceURL;
        priceSourceLinkEl.innerHTML = `Fuente: ${lastMonthData.sourceName}`;

    } catch (error) {
        console.error("Error al obtener datos:", error);
        potValueEl.innerHTML = 'Error';
        lastMonthPriceEl.innerHTML = 'Error';
    }
}
fetchConfigData();
setInterval(fetchConfigData, 120000);


// --- PASO 4: CÓDIGO PARA MOSTRAR ZONAS HORARIAS ---

function displayClosingTimes() {
    const timezonesEl = document.getElementById('timezones');
    if (!timezonesEl) return;

    const cities = [
        { name: 'Bogotá', timeZone: 'America/Bogota' },
        { name: 'São Paulo', timeZone: 'America/Sao_Paulo' },
        { name: 'Buenos Aires', timeZone: 'America/Argentina/Buenos_Aires' },
        { name: 'Madrid', timeZone: 'Europe/Madrid' },
        { name: 'Dubái', timeZone: 'Asia/Dubai' },
        { name: 'Tokio', timeZone: 'Asia/Tokyo' }
    ];

    const options = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    let html = '';
    cities.forEach(city => {
        const localTime = finDeMes.toLocaleTimeString('es-ES', { ...options, timeZone: city.timeZone });
        html += `<span>${city.name}: ${localTime}</span>`;
    });

    timezonesEl.innerHTML = html;
}

// Llamamos a la función una vez que el DOM esté cargado
document.addEventListener('DOMContentLoaded', displayClosingTimes);
