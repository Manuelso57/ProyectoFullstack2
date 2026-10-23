import { Link, useParams } from "react-router-dom"
import { Container } from "react-bootstrap"
import DatosOrden from "../components/DatosOrden"
import { obtenerOrdenPorNumero } from "../data/datos"

function PagoError() {
  const { numero } = useParams()
  const orden = obtenerOrdenPorNumero(numero)

  if (!orden) {
    return (
      <section className="seccion-titulo">
        <h1>Orden no encontrada</h1>
        <Link to="/carrito" className="btn btn-primary boton-grande">Volver al carrito</Link>
      </section>
    )
  }

  return (
    <Container className="contenedor-carrito my-5">
      <div className="formulario-tarjeta formulario-ancho">
        <h2 className="text-danger">✖ No se pudo realizar el pago. nro #{orden.numero}</h2>
        <p>Detalle de la compra</p>
        <div className="text-center mb-3">
          <Link to="/checkout" className="btn btn-success">VOLVER A REALIZAR EL PAGO</Link>
        </div>
        <DatosOrden orden={orden} />
      </div>
    </Container>
  )
}

export default PagoError
