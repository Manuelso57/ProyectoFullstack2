import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { Alert, Button, Container } from "react-bootstrap"
import DatosOrden from "../components/DatosOrden"
import { obtenerOrdenPorNumero } from "../data/datos"

function CompraExitosa() {
  const { numero } = useParams()
  const orden = obtenerOrdenPorNumero(numero)
  const [aviso, setAviso] = useState("")

  if (!orden) {
    return (
      <section className="seccion-titulo">
        <h1>Orden no encontrada</h1>
        <Link to="/productos" className="btn btn-primary boton-grande">Ver productos</Link>
      </section>
    )
  }

  return (
    <Container className="contenedor-carrito my-5">
      <div className="formulario-tarjeta formulario-ancho">
        <p className="text-end small mb-1">Código orden: {orden.codigo}</p>
        <h2 className="text-success">✔ Se ha realizado la compra. nro #{orden.numero}</h2>
        <p>Gracias por tu compra. Este es el resumen de tu pedido.</p>
        <DatosOrden orden={orden} />
        <div className="d-flex flex-wrap justify-content-center gap-2">
          <Button variant="danger" size="sm" onClick={() => window.print()}>Imprimir boleta en PDF</Button>
          <Button variant="success" size="sm" onClick={() => setAviso("Boleta enviada a " + orden.cliente.correo + " (simulado).")}>Enviar boleta por email</Button>
          <Link to="/productos" className="btn btn-outline-primary btn-sm">Seguir comprando</Link>
        </div>
        {aviso && <Alert variant="success" className="mt-3 mb-0" role="status">{aviso}</Alert>}
      </div>
    </Container>
  )
}

export default CompraExitosa
