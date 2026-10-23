import { Link, useParams } from "react-router-dom"
import { Button } from "react-bootstrap"
import DatosOrden from "../components/DatosOrden"
import { obtenerOrdenPorNumero } from "../data/datos"

function Boleta() {
  const { numero } = useParams()
  const orden = obtenerOrdenPorNumero(numero)

  if (!orden) {
    return (
      <>
        <h1>Boleta no encontrada</h1>
        <Link to="/admin/ordenes" className="btn btn-primary">Volver a órdenes</Link>
      </>
    )
  }

  return (
    <>
      <h1>Boleta #{orden.numero}</h1>
      <p>Código: {orden.codigo} · {new Date(orden.fecha).toLocaleString("es-CL")} · Estado: {orden.estado}</p>
      <div className="formulario-tarjeta formulario-ancho mb-3">
        <DatosOrden orden={orden} />
      </div>
      <div className="d-flex gap-2">
        <Button variant="danger" size="sm" onClick={() => window.print()}>Imprimir boleta en PDF</Button>
        <Link to="/admin/ordenes" className="btn btn-outline-primary btn-sm">Volver</Link>
      </div>
    </>
  )
}

export default Boleta
