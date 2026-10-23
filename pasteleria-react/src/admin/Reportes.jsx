import { Row, Col, Table } from "react-bootstrap"
import { obtenerOrdenes, obtenerProductos, obtenerUsuarios } from "../data/datos"
import { calcularReportes } from "../utils/reportes"
import { formatearPrecio } from "../utils/formato"

function Reportes() {
  const reporte = calcularReportes(obtenerOrdenes(), obtenerProductos(), obtenerUsuarios())

  return (
    <>
      <h1>Reportes</h1>
      <Row className="g-3 mb-4">
        <Col sm={6} lg={3}><div className="admin-stat admin-stat--chocolate"><span>Ventas totales</span><strong>{formatearPrecio(reporte.totalVentas)}</strong></div></Col>
        <Col sm={6} lg={3}><div className="admin-stat admin-stat--rosa"><span>Órdenes pagadas</span><strong>{reporte.ordenesPagadas}</strong></div></Col>
        <Col sm={6} lg={3}><div className="admin-stat admin-stat--beige"><span>Ticket promedio</span><strong>{formatearPrecio(reporte.ticketPromedio)}</strong></div></Col>
        <Col sm={6} lg={3}><div className="admin-stat admin-stat--beige"><span>Pagos rechazados</span><strong>{reporte.ordenesRechazadas}</strong></div></Col>
      </Row>
      <h2 className="h4">Productos más vendidos</h2>
      {reporte.masVendidos.length === 0 ? (
        <p role="alert">Aún no hay ventas para reportar.</p>
      ) : (
        <Table responsive className="align-middle tabla-admin">
          <thead><tr><th>Producto</th><th>Unidades</th><th>Monto vendido</th></tr></thead>
          <tbody>
            {reporte.masVendidos.map((item) => (
              <tr key={item.codigo}><td>{item.nombre}</td><td>{item.unidades}</td><td>{formatearPrecio(item.monto)}</td></tr>
            ))}
          </tbody>
        </Table>
      )}
      <h2 className="h4 mt-4">Ventas por categoría</h2>
      <Table responsive className="align-middle tabla-admin">
        <thead><tr><th>Categoría</th><th>Monto vendido</th></tr></thead>
        <tbody>
          {reporte.ventasPorCategoria.map((fila) => (
            <tr key={fila.categoria}><td>{fila.categoria}</td><td>{formatearPrecio(fila.monto)}</td></tr>
          ))}
        </tbody>
      </Table>
      <h2 className="h4 mt-4">Usuarios por tipo</h2>
      <Table responsive className="align-middle tabla-admin">
        <thead><tr><th>Tipo</th><th>Cantidad</th></tr></thead>
        <tbody>
          {Object.entries(reporte.usuariosPorTipo).map(([tipo, cantidad]) => (
            <tr key={tipo}><td>{tipo}</td><td>{cantidad}</td></tr>
          ))}
        </tbody>
      </Table>
      <p>Productos con stock crítico: <strong>{reporte.productosCriticos}</strong></p>
    </>
  )
}

export default Reportes
