import { Link, NavLink, Outlet } from "react-router-dom"
import { Nav } from "react-bootstrap"
import { useSesion } from "../context/SesionContext"

export const ENLACES_ADMIN = [
  { a: "/admin", texto: "Dashboard", fin: true },
  { a: "/admin/ordenes", texto: "Órdenes" },
  { a: "/admin/productos", texto: "Productos" },
  { a: "/admin/categorias", texto: "Categorías" },
  { a: "/admin/usuarios", texto: "Usuarios" },
  { a: "/admin/reportes", texto: "Reportes" },
  { a: "/admin/perfil", texto: "Perfil" }
]

function AdminLayout() {
  const { usuario, cerrarSesion } = useSesion()
  return (
    <div className="admin d-flex flex-column min-vh-100">
      <header className="admin-barra d-flex flex-wrap justify-content-between align-items-center gap-2">
        <span className="marca">Pastelería Mil Sabores · Administración</span>
        <span>{usuario.nombre} ({usuario.tipo})</span>
      </header>
      <div className="d-flex flex-column flex-md-row flex-grow-1">
        <aside className="admin-lateral">
          <Nav as="nav" aria-label="Menú de administración" className="flex-row flex-md-column flex-wrap gap-1">
            {ENLACES_ADMIN.map((enlace) => (
              <Nav.Link key={enlace.a} as={NavLink} to={enlace.a} end={enlace.fin}>{enlace.texto}</Nav.Link>
            ))}
            <hr className="d-none d-md-block w-100" />
            <Nav.Link as={Link} to="/" className="admin-tienda">Tienda</Nav.Link>
            <Nav.Link as="button" type="button" className="admin-salir text-start" onClick={cerrarSesion}>Cerrar sesión</Nav.Link>
          </Nav>
        </aside>
        <main className="admin-contenido flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
