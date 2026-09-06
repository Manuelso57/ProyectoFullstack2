let cupon_aplicado = null;
function renderizar_carrito() {
    const carrito = obtener_carrito();
    const contenedor = document.getElementById("contenedor_carrito");
    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="carrito_vacio">Tu carrito está vacío. <a href="productos.html">Ver productos</a></p>';
        return;
    }
    let filas = "";
    carrito.forEach(item => {
        const producto = productos.find(p => p.codigo === item.codigo);
        if (!producto) return;
        filas += '<div class="fila_carrito">' +
            '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">' +
            '<span class="fila_carrito__nombre">' + producto.nombre + '</span>' +
            '<span class="fila_carrito__precio">$' + producto.precio.toLocaleString("es-CL") + '</span>' +
            '<div class="selector-cantidad">' +
            '<button type="button" class="selector-cantidad__boton" data-restar="' + producto.codigo + '">−</button>' +
            '<input type="number" class="selector-cantidad__valor" value="' + item.cantidad + '" min="1" data-cantidad="' + producto.codigo + '">' +
            '<button type="button" class="selector-cantidad__boton" data-sumar="' + producto.codigo + '">+</button>' +
            '</div>' +
            '<span class="fila_carrito__subtotal">$' + (producto.precio * item.cantidad).toLocaleString("es-CL") + '</span>' +
            '<button type="button" class="fila_carrito__quitar" data-quitar="' + producto.codigo + '">Quitar</button>' +
            '</div>';
    });
    const subtotal = total_precio_carrito();
    const descuento = cupon_aplicado ? Math.round(subtotal * 0.10) : 0;
    const total = subtotal - descuento;
    let resumen = '<div class="resumen_cupon">' +
        '<input type="text" id="input_cupon" placeholder="Código de descuento" maxlength="20">' +
        '<button type="button" id="aplicar_cupon" class="boton_volver">Aplicar</button>' +
        '</div>' +
        '<p id="mensaje_cupon" class="mensaje_cupon"></p>' +
        '<div class="carrito_resumen">' +
        '<div class="carrito_resumen__linea"><span>Subtotal</span><span>$' + subtotal.toLocaleString("es-CL") + '</span></div>';
    if (cupon_aplicado) {
        resumen += '<div class="carrito_resumen__linea"><span>Descuento (FELICES50, 10%)</span><span>-$' + descuento.toLocaleString("es-CL") + '</span></div>';
    }
    resumen += '<div class="carrito_resumen__linea carrito_resumen__total"><span>Total</span><span>$' + total.toLocaleString("es-CL") + '</span></div>' +
        '</div>' +
        '<button type="button" id="boton_comprar" class="boton">Comprar</button>';
    contenedor.innerHTML = filas + resumen;
    document.querySelectorAll("[data-restar]").forEach(boton => {
        boton.addEventListener("click", () => {
            const item = obtener_carrito().find(i => i.codigo === boton.dataset.restar);
            cambiar_cantidad_carrito(boton.dataset.restar, item.cantidad - 1);
            renderizar_carrito();
        });
    });
    document.querySelectorAll("[data-sumar]").forEach(boton => {
        boton.addEventListener("click", () => {
            const item = obtener_carrito().find(i => i.codigo === boton.dataset.sumar);
            cambiar_cantidad_carrito(boton.dataset.sumar, item.cantidad + 1);
            renderizar_carrito();
        });
    });
    document.querySelectorAll("[data-cantidad]").forEach(input => {
        input.addEventListener("change", () => {
            cambiar_cantidad_carrito(input.dataset.cantidad, parseInt(input.value));
            renderizar_carrito();
        });
    });
    document.querySelectorAll("[data-quitar]").forEach(boton => {
        boton.addEventListener("click", () => {
            quitar_del_carrito(boton.dataset.quitar);
            renderizar_carrito();
        });
    });
    document.getElementById("aplicar_cupon").addEventListener("click", () => {
        const codigo = document.getElementById("input_cupon").value.trim().toUpperCase();
        const mensaje = document.getElementById("mensaje_cupon");
        if (codigo === "FELICES50") {
            cupon_aplicado = codigo;
            mensaje.textContent = "Código aplicado: 10% de descuento.";
            mensaje.className = "mensaje_cupon mensaje_cupon--ok";
        } else {
            cupon_aplicado = null;
            mensaje.textContent = "Código no válido.";
            mensaje.className = "mensaje_cupon mensaje_cupon--error";
        }
        renderizar_carrito();
    });
    document.getElementById("boton_comprar").addEventListener("click", () => {
        alert("¡Gracias por tu compra! Total pagado: $" + total.toLocaleString("es-CL"));
        localStorage.removeItem("carrito_mil_sabores");
        cupon_aplicado = null;
        actualizar_contador_carrito();
        renderizar_carrito();
    });
}
document.addEventListener("DOMContentLoaded", renderizar_carrito);