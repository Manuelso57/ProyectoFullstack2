import { Link } from "react-router-dom"
import { Badge, Table } from "react-bootstrap"
import { obtenerOrdenes } from "../data/datos"
import { formatearPrecio } from "../utils/formato"

function Ordenes() {
  const ordenes = [...obtenerOrdenes()].reverse()

  return (
    <>
      <h1>Órdenes y boletas</h1>
      {ordenes.length === 0 ? (
        <p role="alert">Todavía no hay órdenes registradas.</p>
      ) : (
        <Table responsive className="align-middle tabla-admin">
          <thead>
            <tr><th>N° orden</th><th>Fecha</th><th>Cliente</th><th>Estado</th><th>Total</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.numero}>
                <td>#{orden.numero}</td>
                <td>{new Date(orden.fecha).toLocaleString("es-CL")}</td>
                <td>{orden.cliente.nombre} {orden.cliente.apellidos}</td>
                <td><Badge bg={orden.estado === "Pagada" ? "success" : "danger"}>{orden.estado}</Badge></td>
                <td>{formatearPrecio(orden.total)}</td>
                <td><Link to={"/admin/ordenes/" + orden.numero} className="btn btn-outline-primary btn-sm">Ver boleta</Link></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default Ordenes
