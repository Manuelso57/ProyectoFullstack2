import { Link } from "react-router-dom"
import { Button, Container, Form, Table } from "react-bootstrap"
import ResumenTotales from "../components/ResumenTotales"
import { useCarrito } from "../context/CarritoContext"
import { useSesion } from "../context/SesionContext"
import { obtenerProductoPorCodigo } from "../data/datos"
import { calcularResumen, CODIGO_TORTA_CUMPLEANOS } from "../utils/descuentos"
import { formatearPrecio, precioFinal } from "../utils/formato"

function Carrito() {
  const { items, agregar, quitar, cambiarCantidad, vaciar } = useCarrito()
  const { usuario } = useSesion()

  const lineas = items
    .map((item) => ({ producto: obtenerProductoPorCodigo(item.codigo), cantidad: item.cantidad }))
    .filter((linea) => linea.producto)
  const resumen = calcularResumen(lineas, usuario)

  if (lineas.length === 0) {
    return (
      <section className="seccion-titulo">
        <h1>Mi carrito de compras</h1>
        <p>Tu carrito está vacío.</p>
        <Link to="/productos" className="btn btn-primary boton-grande">Ver productos</Link>
      </section>
    )
  }

  return (
    <>
      <section className="seccion-titulo">
        <h1>Mi carrito de compras</h1>
      </section>
      <Container className="contenedor-carrito mb-5">
        {resumen.tortaGratis.elegible && (
          <div className="aviso-cumpleanos" role="status">
            <span>🎂 ¡Feliz cumpleaños! Por ser estudiante Duoc, tu torta de cumpleaños va gratis.</span>
            {!resumen.tortaGratis.enCarrito && (
              <Button variant="outline-primary" size="sm" onClick={() => agregar(CODIGO_TORTA_CUMPLEANOS, 1)}>Agregar torta gratis</Button>
            )}
          </div>
        )}
        <Table responsive className="align-middle">
          <thead>
            <tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {lineas.map(({ producto, cantidad }) => (
              <tr key={producto.codigo}>
                <td><img src={producto.imagen} alt={producto.nombre} className="miniatura" /></td>
                <td>{producto.nombre}</td>
                <td>{formatearPrecio(precioFinal(producto))}</td>
                <td>
                  <div className="selector-cantidad my-0">
                    <Button variant="light" className="selector-cantidad__boton" aria-label={"Restar " + producto.nombre} onClick={() => cambiarCantidad(producto.codigo, cantidad - 1)}>−</Button>
                    <Form.Control type="number" min="1" value={cantidad} aria-label={"Cantidad " + producto.nombre} className="selector-cantidad__valor" onFocus={(e) => e.target.select()} onChange={(e) => cambiarCantidad(producto.codigo, parseInt(e.target.value) || 1)} />
                    <Button variant="light" className="selector-cantidad__boton" aria-label={"Sumar " + producto.nombre} onClick={() => cambiarCantidad(producto.codigo, cantidad + 1)}>+</Button>
                  </div>
                </td>
                <td>{formatearPrecio(precioFinal(producto) * cantidad)}</td>
                <td><Button variant="danger" size="sm" onClick={() => quitar(producto.codigo)}>Eliminar</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
        <ResumenTotales resumen={resumen} />
        <div className="d-flex flex-wrap justify-content-end gap-2 mt-3">
          <Button variant="secondary" onClick={vaciar}>Limpiar</Button>
          <Link to="/checkout" className="btn btn-success">Comprar ahora</Link>
        </div>
      </Container>
    </>
  )
}

export default Carrito
