/* ============================================================
   script.js — Lógica del Clasificador de Funciones
   f(x) = bx + c, con b y c enteros entre -3 y 3
   ============================================================ */

/* ---------- 1. Constantes del rango ---------- */
const MINIMO = -3;   // valor mínimo permitido para b y c
const MAXIMO = 3;    // valor máximo permitido para b y c

/* ---------- 2. Referencias a elementos del HTML ---------- */
const botonGenerar   = document.getElementById("btn-generar");
const salidaB        = document.getElementById("valor-b");
const salidaC        = document.getElementById("valor-c");
const textoFuncion   = document.getElementById("funcion-resultante");
const lienzo         = document.getElementById("lienzo");
const ctx            = lienzo.getContext("2d");

/* Las cuatro cajas de clasificación */
const cajas = {
  lineal:     document.getElementById("caja-lineal"),
  afin:       document.getElementById("caja-afin"),
  constante:  document.getElementById("caja-constante"),
  nofuncion:  document.getElementById("caja-nofuncion")
};

/* ---------- 3. Número entero aleatorio entre min y max (ambos incluidos) ---------- */
function enteroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ---------- 4. Escribe la función de forma legible: f(x) = 2x + 1 ---------- */
function escribirFuncion(b, c) {
  if (b === 0 && c === 0) return "f(x) = 0";
  if (b === 0) return "f(x) = " + c;

  /* Término de x: omite el 1 (x) y escribe −x cuando b = −1 */
  let termino;
  if (b === 1)       termino = "x";
  else if (b === -1) termino = "−x";
  else               termino = b + "x";

  if (c === 0) return "f(x) = " + termino;
  const signo = c > 0 ? " + " : " − ";
  return "f(x) = " + termino + signo + Math.abs(c);
}

/* ---------- 5. Clasifica la función con if / else ---------- */
function clasificar(b, c) {
  if (b !== 0 && c === 0) {
    return "lineal";
  } else if (b !== 0 && c !== 0) {
    return "afin";
  } else if (b === 0 && c !== 0) {
    return "constante";
  } else {
    return "nofuncion";   // b = 0 y c = 0
  }
}

/* ---------- 6. Propiedades de cada tipo de función ---------- */
function obtenerPropiedades(tipo, b, c) {
  if (tipo === "lineal") {
    return [
      "Gráfica: línea recta continua.",
      "Pasa por el origen (0, 0).",
      b > 0
        ? "Pendiente b = " + b + " > 0: función creciente."
        : "Pendiente b = " + b + " < 0: función decreciente."
    ];
  }
  if (tipo === "afin") {
    return [
      "Gráfica: línea recta que no pasa por el origen.",
      "Corta el eje Y en (0, " + c + ").",
      b > 0
        ? "Pendiente b = " + b + " > 0: función creciente."
        : "Pendiente b = " + b + " < 0: función decreciente.",
      "Es la traslación vertical de f(x) = " + b + "x en " + c + " unidades."
    ];
  }
  if (tipo === "constante") {
    return [
      "Gráfica: recta horizontal y = " + c + ".",
      "Corta el eje Y en (0, " + c + ") y no corta el eje X.",
      "Pendiente b = 0: ni crece ni decrece.",
      "Todos los valores de x tienen la misma imagen: " + c + "."
    ];
  }
  /* tipo "nofuncion" */
  return [
    "Con b = 0 y c = 0 resulta f(x) = 0.",
    "No es de primer grado: no hay término en x ni constante distinta de cero.",
    "Su gráfica es el propio eje X (y = 0)."
  ];
}

/* ---------- 7. Muestra las propiedades solo en la caja correspondiente ---------- */
function mostrarClasificacion(tipo, b, c) {
  /* Primero limpia todas las cajas */
  for (const nombre in cajas) {
    cajas[nombre].classList.remove("activa");
    cajas[nombre].querySelector(".propiedades").innerHTML = "";
  }

  /* Luego llena y resalta únicamente la caja que corresponde */
  const lista = cajas[tipo].querySelector(".propiedades");
  obtenerPropiedades(tipo, b, c).forEach(function (texto) {
    const item = document.createElement("li");
    item.textContent = texto;
    lista.appendChild(item);
  });
  cajas[tipo].classList.add("activa");
}

/* ---------- 8. Dibuja el plano cartesiano y la función ---------- */
function dibujarGrafica(b, c) {
  const ancho = lienzo.width;
  const alto = lienzo.height;
  const unidades = 10;               // el plano va de -10 a 10 en ambos ejes
  const paso = ancho / (2 * unidades);
  const centro = ancho / 2;

  /* Convierte coordenadas matemáticas a píxeles */
  const px = (x) => centro + x * paso;
  const py = (y) => centro - y * paso;

  ctx.clearRect(0, 0, ancho, alto);

  /* Cuadrícula */
  ctx.strokeStyle = "#ffedd5";
  ctx.lineWidth = 1;
  for (let i = -unidades; i <= unidades; i++) {
    ctx.beginPath(); ctx.moveTo(px(i), 0); ctx.lineTo(px(i), alto); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, py(i)); ctx.lineTo(ancho, py(i)); ctx.stroke();
  }

  /* Ejes X e Y */
  ctx.strokeStyle = "#c2410c";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, centro); ctx.lineTo(ancho, centro); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(centro, 0); ctx.lineTo(centro, alto); ctx.stroke();

  /* Recta f(x) = bx + c, evaluada en los bordes del plano */
  ctx.strokeStyle = "#f97316";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(px(-unidades), py(b * -unidades + c));
  ctx.lineTo(px(unidades),  py(b * unidades + c));
  ctx.stroke();

  /* Punto donde la recta corta el eje Y: (0, c) */
  ctx.fillStyle = "#c2410c";
  ctx.beginPath();
  ctx.arc(px(0), py(c), 5, 0, Math.PI * 2);
  ctx.fill();
}

/* ---------- 9. Evento del botón: genera b y c y actualiza todo ---------- */
botonGenerar.addEventListener("click", function () {
  const b = enteroAleatorio(MINIMO, MAXIMO);
  const c = enteroAleatorio(MINIMO, MAXIMO);

  /* Muestra los coeficientes (con el signo menos tipográfico) */
  salidaB.textContent = String(b).replace("-", "−");
  salidaC.textContent = String(c).replace("-", "−");

  /* Muestra la función, clasifica y actualiza cajas y gráfica */
  textoFuncion.textContent = escribirFuncion(b, c);
  mostrarClasificacion(clasificar(b, c), b, c);
  dibujarGrafica(b, c);
});

/* ---------- 10. Gráfica inicial vacía (solo ejes) al cargar la página ---------- */
dibujarGrafica(0, 0);