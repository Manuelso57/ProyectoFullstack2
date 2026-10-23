import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Button, Form } from "react-bootstrap"
import { useCarrito } from "../context/CarritoContext"
import { obtenerProductoPorCodigo } from "../data/datos"
import { formatearPrecio, precioFinal, estaEnOferta } from "../utils/formato"

function DetalleProducto() {
  const { codigo } = useParams()
  const producto = obtenerProductoPorCodigo(codigo)
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)
  const { agregar } = useCarrito()

  if (!producto) {
    return (
      <section className="seccion-titulo">
        <h1>Producto no encontrado</h1>
        <p>Vuelve al catálogo e intenta de nuevo.</p>
        <Link to="/productos" className="btn btn-outline-primary boton-grande">Volver</Link>
      </section>
    )
  }

  const añadir = () => {
    agregar(producto.codigo, cantidad)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1200)
  }

  return (
    <section className="detalle-producto">
      <div className="detalle-producto__imagen">
        <img src={producto.imagen} alt={producto.nombre} />
      </div>
      <div className="detalle-producto__info">
        <span className="detalle-producto__categoria">{producto.categoria}</span>
        <h1>{producto.nombre}</h1>
        <p className="detalle-producto__precio">
          {estaEnOferta(producto) && <span className="precio-original">{formatearPrecio(producto.precio)}</span>}
          <span>{formatearPrecio(precioFinal(producto))}</span>
          {estaEnOferta(producto) && <span className="insignia-oferta insignia-oferta--en-linea">-{producto.descuentoOferta}%</span>}
        </p>
        <p>{producto.descripcion}</p>
        <p className="mb-0">Stock disponible: {producto.stock}</p>
        <Form.Group controlId="cantidad-detalle" className="selector-cantidad">
          <Button variant="light" className="selector-cantidad__boton" aria-label="Restar cantidad" onClick={() => setCantidad((c) => Math.max(1, c - 1))}>−</Button>
          <Form.Control type="number" min="1" value={cantidad} aria-label="Cantidad" className="selector-cantidad__valor" onFocus={(e) => e.target.select()} onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))} />
          <Button variant="light" className="selector-cantidad__boton" aria-label="Sumar cantidad" onClick={() => setCantidad((c) => c + 1)}>+</Button>
        </Form.Group>
        <div className="d-flex flex-wrap gap-2">
          <Button variant="primary" className="boton-grande" disabled={producto.stock <= 0} onClick={añadir}>{agregado ? "Añadido al carrito" : "Añadir al carrito"}</Button>
          <Link to="/productos" className="btn btn-outline-primary boton-grande">Volver</Link>
        </div>
      </div>
    </section>
  )
}

export default DetalleProducto
