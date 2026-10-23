import { useState } from "react"
import { Link } from "react-router-dom"
import { Badge, Button, Table } from "react-bootstrap"
import { obtenerProductos, eliminarProducto } from "../data/datos"
import { formatearPrecio, precioFinal, estaEnOferta } from "../utils/formato"
import { productoCritico } from "../utils/reportes"

function Productos() {
  const [, setVersion] = useState(0)
  const productos = obtenerProductos()

  const eliminar = (producto) => {
    if (!window.confirm("¿Eliminar el producto " + producto.nombre + "?")) return
    eliminarProducto(producto.codigo)
    setVersion((v) => v + 1)
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="mb-0">Productos</h1>
        <div className="d-flex flex-wrap gap-2">
          <Link to="/admin/productos/criticos" className="btn btn-outline-primary">Productos críticos</Link>
          <Link to="/admin/reportes" className="btn btn-outline-primary">Reportes</Link>
          <Link to="/admin/productos/nuevo" className="btn btn-primary">Nuevo producto</Link>
        </div>
      </div>
      <Table responsive className="align-middle tabla-admin">
        <thead>
          <tr><th>Código</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.codigo}>
              <td>{producto.codigo}</td>
              <td>{producto.nombre}</td>
              <td>{producto.categoria}</td>
              <td>
                {estaEnOferta(producto) && <span className="precio-original">{formatearPrecio(producto.precio)}</span>}
                {formatearPrecio(precioFinal(producto))}
              </td>
              <td>{producto.stock} {productoCritico(producto) && <Badge bg="danger">Stock crítico</Badge>}</td>
              <td className="d-flex gap-2">
                <Link to={"/admin/productos/" + producto.codigo + "/editar"} className="btn btn-outline-primary btn-sm">Editar</Link>
                <Button variant="danger" size="sm" onClick={() => eliminar(producto)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default Productos
