const CODIGO_TORTA_CUMPLEANOS = "TE001";
function calcularDescuentoActivo() {
    const usuario = obtenerUsuarioActual();
    return obtenerDescuentoUsuario(usuario);
}
function renderizar_carrito() {
    const carrito = obtener_carrito();
    const contenedor = document.getElementById("contenedor_carrito");
    if (carrito.length === 0) {
        contenedor.innerHTML = '<p class="carrito_vacio">Tu carrito está vacío. <a href="productos.html">Ver productos</a></p>';
        return;
    }
    const usuario = obtenerUsuarioActual();
    const elegibleTortaGratis = usuario && esCorreoDuoc(usuario.correo) && esCumpleanosHoy(usuario.fechaNacimiento) && !yaReclamoTortaGratis(usuario);
    const tieneTortaEnCarrito = carrito.some(item => item.codigo === CODIGO_TORTA_CUMPLEANOS);
    let avisoCumpleanos = "";
    if (elegibleTortaGratis) {
        if (tieneTortaEnCarrito) {
            avisoCumpleanos = '<p class="aviso_cumpleanos">🎂 ¡Feliz cumpleaños! Por ser estudiante Duoc, tu torta de cumpleaños va gratis. El descuento ya está aplicado en el total.</p>';
        } else {
            avisoCumpleanos = '<p class="aviso_cumpleanos">🎂 ¡Feliz cumpleaños! Por ser estudiante Duoc, tienes una torta de cumpleaños gratis. <button type="button" id="agregar_torta_gratis" class="boton_volver">Agregar torta gratis</button></p>';
        }
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
    const descuentoInfo = calcularDescuentoActivo();
    const descuentoPorcentaje = Math.round(subtotal * descuentoInfo.porcentaje / 100);
    let descuentoTorta = 0;
    if (elegibleTortaGratis && tieneTortaEnCarrito) {
        const productoTorta = productos.find(p => p.codigo === CODIGO_TORTA_CUMPLEANOS);
        if (productoTorta) descuentoTorta = productoTorta.precio;
    }
    const totalDescuentos = descuentoPorcentaje + descuentoTorta;
    const total = subtotal - totalDescuentos;
    let resumen = "";
    if (descuentoInfo.porcentaje > 0) {
        resumen += '<p class="mensaje_cupon mensaje_cupon--ok">Descuento automático aplicado: ' + descuentoInfo.motivo + '</p>';
    }
    resumen += '<div class="carrito_resumen">' +
        '<div class="carrito_resumen__linea"><span>Subtotal</span><span>$' + subtotal.toLocaleString("es-CL") + '</span></div>';
    if (descuentoPorcentaje > 0) {
        resumen += '<div class="carrito_resumen__linea"><span>Descuento (' + descuentoInfo.motivo + ', ' + descuentoInfo.porcentaje + '%)</span><span>-$' + descuentoPorcentaje.toLocaleString("es-CL") + '</span></div>';
    }
    if (descuentoTorta > 0) {
        resumen += '<div class="carrito_resumen__linea"><span>Torta de cumpleaños gratis (Duoc)</span><span>-$' + descuentoTorta.toLocaleString("es-CL") + '</span></div>';
    }
    resumen += '<div class="carrito_resumen__linea carrito_resumen__total"><span>Total</span><span>$' + total.toLocaleString("es-CL") + '</span></div>' +
        '</div>' +
        '<button type="button" id="boton_comprar" class="boton">Comprar</button>';
    contenedor.innerHTML = avisoCumpleanos + filas + resumen;
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
    const botonTortaGratis = document.getElementById("agregar_torta_gratis");
    if (botonTortaGratis) {
        botonTortaGratis.addEventListener("click", () => {
            agregar_al_carrito(CODIGO_TORTA_CUMPLEANOS, 1);
            renderizar_carrito();
        });
    }
    document.getElementById("boton_comprar").addEventListener("click", () => {
        if (descuentoTorta > 0) {
            marcarTortaGratisReclamada(usuario.correo);
        }
        const mensajeCompra = descuentoTorta > 0
            ? "¡Gracias por tu compra! Regalo por ser de Duoc UC. Total pagado: $" + total.toLocaleString("es-CL")
            : "¡Gracias por tu compra! Total pagado: $" + total.toLocaleString("es-CL");
        alert(mensajeCompra);
        localStorage.removeItem("carrito_mil_sabores");
        actualizar_contador_carrito();
        renderizar_carrito();
    });
}
document.addEventListener("DOMContentLoaded", renderizar_carrito);