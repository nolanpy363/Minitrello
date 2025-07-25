// js/test.js

console.log("--- El archivo test.js se ha cargado. ---");

document.addEventListener('DOMContentLoaded', () => {
    console.log("--- DOM cargado. Buscando el formulario... ---");

    const form = document.getElementById('create-list-form');

    if (form) {
        console.log("--- Formulario encontrado. Añadiendo listener... ---");
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log("--- ¡SUBMIT DETECTADO! ---");
            alert("¡EL LISTENER FUNCIONA!");
        });
    } else {
        console.error("--- ¡ERROR! No se encontró el formulario 'create-list-form'. ---");
    }
});