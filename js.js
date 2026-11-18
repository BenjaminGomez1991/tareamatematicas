const valorB = document.getElementById("valor-b");
const valorC = document.getElementById("valor-c");
const funcionActual = document.getElementById("funcion-actual");
const btnGenerar = document.getElementById("btn-generar");

const cajaLineal = document.getElementById("caja-lineal");
const cajaAfin = document.getElementById("caja-afin");
const listaLineal = document.getElementById("lista-lineal");
const listaAfin = document.getElementById("lista-afin");

// Entero aleatorio entre -10 y 10 (ambos incluidos)
function enteroAleatorio() {
    return Math.floor(Math.random() * 21) - 10;
}

// Texto de la pendiente según el signo de b
function textoPendiente(b) {
    if (b > 0) {
        return "Pendiente b = " + b + " > 0: función creciente (sube de izquierda a derecha).";
    } else if (b < 0) {
        return "Pendiente b = " + b + " < 0: función decreciente (baja de izquierda a derecha).";
    } else {
        return "Pendiente b = 0: la recta es horizontal (ni crece ni decrece).";
    }
}

// Expresión escrita de forma legible, ej: f(x) = -3x + 5
function escribirFuncion(b, c) {
    if (c === 0) {
        return "f(x) = " + b + "x";
    }
    const signo = c > 0 ? "+" : "-";
    return "f(x) = " + b + "x " + signo + " " + Math.abs(c);
}

function mostrarLista(lista, items) {
    lista.innerHTML = "";
    items.forEach(function (texto) {
        const li = document.createElement("li");
        li.textContent = texto;
        lista.appendChild(li);
    });
}

function limpiarCaja(caja, lista) {
    caja.classList.remove("activa");
    lista.innerHTML = '<li class="vacio">No corresponde a esta función.</li>';
}

function generar() {
    const b = enteroAleatorio();
    const c = enteroAleatorio();

    valorB.textContent = b;
    valorC.textContent = c;
    funcionActual.textContent = escribirFuncion(b, c);

    if (c === 0) {
        // FUNCIÓN LINEAL
        cajaLineal.classList.add("activa");
        mostrarLista(listaLineal, [
            "Expresión: f(x) = " + b + "x",
            "Gráfica: línea recta continua.",
            "Pasa obligatoriamente por el origen (0, 0).",
            textoPendiente(b)
        ]);
        limpiarCaja(cajaAfin, listaAfin);
    } else {
        // FUNCIÓN AFÍN
        cajaAfin.classList.add("activa");
        mostrarLista(listaAfin, [
            "Expresión: " + escribirFuncion(b, c),
            "Gráfica: línea recta que no pasa por el origen.",
            "Corta el eje Y en el punto (0, " + c + ").",
            textoPendiente(b),
            "Es una traslación vertical de f(x) = " + b + "x en " + c + " unidades."
        ]);
        limpiarCaja(cajaLineal, listaLineal);
    }
}

btnGenerar.addEventListener("click", generar);