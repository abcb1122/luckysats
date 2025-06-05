// --- PASO 1: CÓDIGO DEL CONTADOR REGRESIVO ---
// (Este código no cambia, déjalo como está)
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
// (Este código no cambia, déjalo como está)
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

// --- PASO 3: CÓDIGO DEL POTE Y DATOS HISTÓRICOS ---
const potValueEl = document.getElementById('pot-value');
const lastMonthPriceEl = document.getElementById('last-month-price');
const priceSourceLinkEl = document.getElementById('price-source-link');

async function fetchPotData() {
    try {
        const workerUrl = 'https://solitary-wildflower-a068.arielbcb.workers.dev/';
        const potResponse = await fetch(workerUrl);
        const potData = await potResponse.json();
        potValueEl.innerHTML = `${potData.balance.toLocaleString('en-US')} Satoshis`;
    } catch (error) {
        console.error("Error al obtener datos del pote:", error);
        potValueEl.innerHTML = 'Error';
    }
}

async function fetchPreviousMonthClose() {
    try {
        const today = new Date();
        const firstDayCurrentMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));
        const lastDayPreviousMonth = new Date(firstDayCurrentMonth.getTime() - (24 * 60 * 60 * 1000));
        const day = String(lastDayPreviousMonth.getUTCDate()).padStart(2, '0');
        const month = String(lastDayPreviousMonth.getUTCMonth() + 1).padStart(2, '0');
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
            // --- CAMBIO AQUÍ ---
            priceSourceLinkEl.href = 'https://www.coingecko.com/es/monedas/bitcoin/historical_data'; 
            priceSourceLinkEl.innerHTML = `Fuente: CoinGecko (${day}/${month}/${year})`;
        } else {
            lastMonthPriceEl.innerHTML = 'Dato no disponible';
            priceSourceLinkEl.innerHTML = 'Fuente: CoinGecko';
            // --- CAMBIO AQUÍ ---
            priceSourceLinkEl.href = 'https://www.coingecko.com/es/monedas/bitcoin/historical_data';
        }

    } catch (error) {
        console.error("Error al obtener el precio histórico:", error);
        lastMonthPriceEl.innerHTML = 'Error';
        priceSourceLinkEl.innerHTML = 'Fuente: CoinGecko';
        // --- CAMBIO AQUÍ ---
        priceSourceLinkEl.href = 'https://www.coingecko.com/es/monedas/bitcoin/historical_data';
    }
}

fetchPotData();
setInterval(fetchPotData, 120000);
fetchPreviousMonthClose();

// --- PASO 4: CÓDIGO PARA MOSTRAR ZONAS HORARIAS ---
// (Este código no cambia, déjalo como está)
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
    const options = { hour: 'numeric', minute: 'numeric', hour12: false };
    let html = '';
    cities.forEach(city => {
        const localTime = finDeMes.toLocaleTimeString('es-CO', { ...options, timeZone: city.timeZone });
        html += `<span class="whitespace-nowrap">${city.name} (${city.offset}): ${localTime}h</span>`;
    });
    timezonesEl.innerHTML = html;
}

// --- PASO 5: CÓDIGO PARA LA SECCIÓN DE PARTICIPACIÓN ---
// (Este código no cambia, déjalo como está)
const lnAddressForPayment = "luck@pay.abcbbtc.com";
function generatePaymentQRCode() {
    const qrCodeEl = document.getElementById("payment-qrcode");
    if (qrCodeEl) {
        qrCodeEl.innerHTML = ""; 
        new QRCode(qrCodeEl, {
            text: `lightning:${lnAddressForPayment}`,
            width: 160,
            height: 160,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    } else {
        console.error("Elemento para el QR no encontrado: payment-qrcode");
    }
}
function copyPaymentLNAddress() {
    const lnAddressInput = document.getElementById("ln-address-payment");
    if (lnAddressInput && lnAddressInput.value) {
        navigator.clipboard.writeText(lnAddressInput.value).then(() => {
            alert("¡LN Address copiada al portapapeles!");
        }).catch(err => {
            console.error('Error al copiar la LN Address con navigator.clipboard: ', err);
            try {
                lnAddressInput.select();
                document.execCommand('copy');
                alert("¡LN Address copiada! (Fallback)");
            } catch (e) {
                console.error('Error al copiar la LN Address con document.execCommand: ', e);
                alert("Error al copiar. Por favor, cópiala manualmente.");
            }
        });
    } else {
        console.error("Input para LN Address no encontrado o vacío.");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayClosingTimes();
    generatePaymentQRCode();
});
