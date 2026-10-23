import { Link } from "react-router-dom"
import { Row, Col } from "react-bootstrap"
import { useSesion } from "../context/SesionContext"
import { obtenerOrdenes, obtenerProductos, obtenerUsuarios } from "../data/datos"
import { ENLACES_ADMIN } from "./AdminLayout"
import { obtenerProductosCriticos } from "../utils/reportes"

const descripciones = {
  "/admin": "Visión general de las métricas y estadísticas clave.",
  "/admin/ordenes": "Gestión y seguimiento de las órdenes de compra realizadas.",
  "/admin/productos": "Administrar inventario y detalles de los productos disponibles.",
  "/admin/categorias": "Organizar productos en categorías para facilitar su navegación.",
  "/admin/usuarios": "Gestión de cuentas de usuario y sus roles dentro del sistema.",
  "/admin/reportes": "Generación de informes detallados sobre las operaciones del sistema.",
  "/admin/perfil": "Administración de la información personal y configuración de cuenta."
}

function Dashboard() {
  const { usuario } = useSesion()
  const ordenes = obtenerOrdenes()
  const productos = obtenerProductos()
  const compras = ordenes.filter((orden) => orden.estado === "Pagada").length
  const inventario = productos.reduce((suma, producto) => suma + producto.stock, 0)
  const criticos = obtenerProductosCriticos(productos).length

  return (
    <>
      <h1>Dashboard</h1>
      <p>¡Hola {usuario.nombre}! Este es el resumen de las actividades diarias.</p>
      <Row className="g-3 mb-4">
        <Col md={4}>
          <div className="admin-stat admin-stat--chocolate">
            <span>Compras</span>
            <strong>{compras}</strong>
            <small>Órdenes pagadas</small>
          </div>
        </Col>
        <Col md={4}>
          <div className="admin-stat admin-stat--rosa">
            <span>Productos</span>
            <strong>{productos.length}</strong>
            <small>Inventario actual: {inventario}</small>
          </div>
        </Col>
        <Col md={4}>
          <div className="admin-stat admin-stat--beige">
            <span>Usuarios</span>
            <strong>{obtenerUsuarios().length}</strong>
            <small>Productos en stock crítico: {criticos}</small>
          </div>
        </Col>
      </Row>
      <Row className="g-3">
        {ENLACES_ADMIN.map((enlace) => (
          <Col key={enlace.a} sm={6} lg={4}>
            <Link to={enlace.a} className="admin-modulo">
              <h2 className="h5">{enlace.texto}</h2>
              <p className="mb-0">{descripciones[enlace.a]}</p>
            </Link>
          </Col>
        ))}
        <Col sm={6} lg={4}>
          <Link to="/" className="admin-modulo">
            <h2 className="h5">Tienda</h2>
            <p className="mb-0">Visualiza tu tienda en tiempo real.</p>
          </Link>
        </Col>
      </Row>
    </>
  )
}

export default Dashboard
