import { useState } from "react"
import { Link } from "react-router-dom"
import { Alert, Button, Table } from "react-bootstrap"
import { obtenerCategorias, obtenerProductos, eliminarCategoria } from "../data/datos"

function Categorias() {
  const [, setVersion] = useState(0)
  const [error, setError] = useState("")
  const categorias = obtenerCategorias()
  const productos = obtenerProductos()

  const eliminar = (nombre) => {
    if (!window.confirm("¿Eliminar la categoría " + nombre + "?")) return
    const resultado = eliminarCategoria(nombre)
    setError(resultado.ok ? "" : resultado.error)
    setVersion((v) => v + 1)
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="mb-0">Categorías</h1>
        <Link to="/admin/categorias/nueva" className="btn btn-primary">Nueva categoría</Link>
      </div>
      {error && <Alert variant="danger" role="alert">{error}</Alert>}
      <Table responsive className="align-middle tabla-admin">
        <thead>
          <tr><th>Nombre</th><th>Productos</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {categorias.map((nombre) => (
            <tr key={nombre}>
              <td>{nombre}</td>
              <td>{productos.filter((p) => p.categoria === nombre).length}</td>
              <td className="d-flex gap-2">
                <Link to={"/admin/categorias/" + encodeURIComponent(nombre) + "/editar"} className="btn btn-outline-primary btn-sm">Editar</Link>
                <Button variant="danger" size="sm" onClick={() => eliminar(nombre)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default Categorias
