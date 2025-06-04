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
