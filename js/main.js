// --- PASO 1: CÓDIGO DEL CONTADOR REGRESIVO ---
const countdownEl = document.getElementById('countdown');
const hoy = new Date();
const finDeMes = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() + 1, 0, 23, 59, 59));
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

// --- PASO 3: CÓDIGO DEL POTE ---
const potValueEl = document.getElementById('pot-value');
async function fetchPotData() {
    try {
        const workerUrl = 'https://solitary-wildflower-a068.arielbcb.workers.dev/';
        const potResponse = await fetch(workerUrl);
        const potData = await potResponse.json();
        potValueEl.innerHTML = `${potData.balance.toLocaleString('en-US')} SATS`;
    } catch (error) {
        console.error("Error al obtener datos del pote:", error);
        potValueEl.innerHTML = 'Error';
    }
}
fetchPotData();
setInterval(fetchPotData, 120000);

// --- NUEVA FUNCIÓN PARA EL PRECIO HISTÓRICO ---
const lastMonthPriceEl = document.getElementById('last-month-price');
const priceSourceLinkEl = document.getElementById('price-source-link');

async function fetchPreviousMonthClose() {
    try {
        const today = new Date();
        // Obtenemos el primer día del mes actual
        const firstDayCurrentMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
        // Restamos un día para obtener el último día del mes anterior
        const lastDayPreviousMonth = new Date(firstDayCurrentMonth.getTime() - (24 * 60 * 60 * 1000));

        // Formateamos la fecha a dd-mm-yyyy para la API de CoinGecko
        const day = String(lastDayPreviousMonth.getUTCDate()).padStart(2, '0');
        const month = String(lastDayPreviousMonth.getUTCMonth() + 1).padStart(2, '0'); // Meses son 0-indexados
        const year = lastDayPreviousMonth.getUTCFullYear();
        const dateForAPI = `${day}-${month}-${year}`;

        const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/history?date=${dateForAPI}&localization=false`);
        if (!response.ok) {
            throw new Error(`Error de CoinGecko Histórico: ${response.statusText}`);
        }
        const data = await response.json();

        if (data && data.market_data && data.market_data.current_price && data.market_data.current_price.usd) {
            const closingPrice = data.market_data.current_price.usd;
            lastMonthPriceEl.innerHTML = closingPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
            priceSourceLinkEl.href = `https://www.coingecko.com/es/monedas/bitcoin/historical_data/${year}-${month}-${day}#panel`; // Enlace aproximado
            priceSourceLinkEl.innerHTML = `Fuente: CoinGecko (${day}/${month}/${year})`;
        } else {
            lastMonthPriceEl.innerHTML = 'Dato no disponible';
            priceSourceLinkEl.innerHTML = 'Fuente: CoinGecko';
        }

    } catch (error) {
        console.error("Error al obtener el precio histórico:", error);
        lastMonthPriceEl.innerHTML = 'Error';
        priceSourceLinkEl.innerHTML = 'Fuente: CoinGecko';
        priceSourceLinkEl.href = 'https://www.coingecko.com/es/monedas/bitcoin';
    }
}
fetchPreviousMonthClose(); // Llamamos la nueva función

// --- PASO 4: CÓDIGO PARA MOSTRAR ZONAS HORARIAS (Corregido) ---
function displayClosingTimes() {
    const timezonesEl = document.getElementById('timezones');
    if (!timezonesEl) return;
    const cities = [
        { name: 'Bogotá', timeZone: 'America/Bogota', offset: 'UTC-5' },
        { name: 'São Paulo', timeZone: 'America/Sao_Paulo', offset: 'UTC-3' },
        { name: 'Buenos Aires', timeZone: 'America/Argentina/Buenos_Aires', offset: 'UTC-3' },
        { name: 'Madrid', timeZone: 'Europe/Madrid', offset: 'UTC+2' }, // Puede variar con DST
        { name: 'Dubái', timeZone: 'Asia/Dubai', offset: 'UTC+4' },
        { name: 'Tokio', timeZone: 'Asia/Tokyo', offset: 'UTC+9' }
    ];
    const options = { hour: 'numeric', minute: 'numeric', hour12: false };
    let html = '';
    cities.forEach(city => {
        const localTime = finDeMes.toLocaleTimeString('es-CO', { ...options, timeZone: city.timeZone });
        html += `<span class="whitespace-nowrap">${city.name} (${city.offset}): ${localTime}h</span>`;
    });
    timezonesEl.innerHTML = html;
}
document.addEventListener('DOMContentLoaded', displayClosingTimes);
