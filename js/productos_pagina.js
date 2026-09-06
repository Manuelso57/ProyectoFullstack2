document.querySelectorAll(".tarjeta-producto__acciones button").forEach(function(boton) {
    boton.addEventListener("click", function() {
        agregar_al_carrito(boton.dataset.codigo, 1);
        boton.textContent = "Añadido";
        setTimeout(function() { boton.textContent = "Añadir"; }, 1200);
    });
});