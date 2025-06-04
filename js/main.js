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
const prizePotEl = document.getElementById('prize-pot'); // Nuevo elemento para el premio
const lastMonthPriceEl = document.getElementById('last-month-price');
const priceSourceLinkEl = document.getElementById('price-source-link');
async function fetchConfigData() {
    try {
        const workerUrl = 'https://solitary-wildflower-a068.arielbcb.workers.dev/';
        const potResponse = await fetch(workerUrl);
        const potData = await potResponse.json();
        
        // Mostramos el Bote Total
        potValueEl.innerHTML = `${potData.totalBalance.toLocaleString('en-US')} Satoshis`;
        // Mostramos el Premio para el Ganador
        prizePotEl.innerHTML = `Premio: ${potData.prizePot.toLocaleString('en-US')} sats`;

        const lastMonthData = {
            name: "Mayo 2025",
            closingPrice: "$102,500",
            sourceName: "Kraken",
            sourceURL: "https://www.kraken.com/prices/btc-bitcoin-price-chart/usd-us-dollar"
        };
        lastMonthPriceEl.innerHTML = lastMonthData.closingPrice;
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
        { name: 'Bogotá', timeZone: 'America/Bogota', offset: 'UTC-5' },
        { name: 'São Paulo', timeZone: 'America/Sao_Paulo', offset: 'UTC-3' },
        { name: 'Buenos Aires', timeZone: 'America/Argentina/Buenos_Aires', offset: 'UTC-3' },
        { name: 'Madrid', timeZone: 'Europe/Madrid', offset: 'UTC+2' },
        { name: 'Dubái', timeZone: 'Asia/Dubai', offset: 'UTC+4' },
        { name: 'Tokio', timeZone: 'Asia/Tokyo', offset: 'UTC+9' }
    ];
    const options = { hour: '2-digit', minute: '2-digit', hour12: true };
    let html = '';
    cities.forEach(city => {
        const localTime = finDeMes.toLocaleTimeString('es-ES', { ...options, timeZone: city.timeZone });
        html += `<span class="whitespace-nowrap">${city.name} (${city.offset}): ${localTime}</span>`;
    });
    timezonesEl.innerHTML = html;
}
document.addEventListener('DOMContentLoaded', displayClosingTimes);
