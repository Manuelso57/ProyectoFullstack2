import { Link } from "react-router-dom"
import { Table } from "react-bootstrap"
import { obtenerProductos } from "../data/datos"
import { obtenerProductosCriticos } from "../utils/reportes"

function ProductosCriticos() {
  const criticos = obtenerProductosCriticos(obtenerProductos())

  return (
    <>
      <h1>Productos con stock crítico</h1>
      <p>Productos cuyo stock es igual o inferior a su stock crítico.</p>
      {criticos.length === 0 ? (
        <p role="alert">No hay productos con stock crítico.</p>
      ) : (
        <Table responsive className="align-middle tabla-admin">
          <thead>
            <tr><th>Código</th><th>Nombre</th><th>Stock</th><th>Stock crítico</th></tr>
          </thead>
          <tbody>
            {criticos.map((producto) => (
              <tr key={producto.codigo}>
                <td>{producto.codigo}</td>
                <td>{producto.nombre}</td>
                <td>{producto.stock}</td>
                <td>{producto.stockCritico}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <Link to="/admin/productos" className="btn btn-outline-primary">Volver a productos</Link>
    </>
  )
}

export default ProductosCriticos
