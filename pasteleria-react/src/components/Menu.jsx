import { Link, NavLink, useNavigate } from "react-router-dom"
import { Navbar, Nav, NavDropdown } from "react-bootstrap"
import { useCarrito } from "../context/CarritoContext"
import { useSesion } from "../context/SesionContext"
import { obtenerCategorias } from "../data/datos"

function Menu() {
  const { totalItems } = useCarrito()
  const { usuario, cerrarSesion } = useSesion()
  const navegar = useNavigate()
  const salir = (evento) => {
    evento.preventDefault()
    cerrarSesion()
    navegar("/")
  }
  const categorias = obtenerCategorias()

  return (
    <header className="encabezado">
      <Navbar expand="xl" className="barra" collapseOnSelect>
        <Navbar.Brand as={Link} to="/" className="logo">
          <img src="/imagenes/logo.png" alt="Logo Mil Sabores" className="logo-imagen" />
          <span>Pastelería Mil Sabores</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-colapsable" />
        <Navbar.Collapse id="menu-colapsable" className="justify-content-end">
          <div className="enlaces d-flex flex-column flex-xl-row align-items-start align-items-xl-center mt-3 mt-xl-0">
            <Nav as="ul" className="menu">
              <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
              <Nav.Link as={NavLink} to="/productos" end>Productos</Nav.Link>
              <NavDropdown title="Categorías" id="menu-categorias">
                <NavDropdown.Item as={Link} to="/categorias">Todas las categorías</NavDropdown.Item>
                <NavDropdown.Divider />
                {categorias.map((categoria) => (
                  <NavDropdown.Item key={categoria} as={Link} to={"/categorias/" + encodeURIComponent(categoria)}>
                    {categoria}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <Nav.Link as={NavLink} to="/ofertas">Ofertas</Nav.Link>
              <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
              <Nav.Link as={NavLink} to="/blogs">Blogs</Nav.Link>
              <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
            </Nav>
            <Nav as="ul" className="acciones mt-3 mt-xl-0">
              {usuario ? (
                <>
                  <span className="saludo">Hola, {usuario.nombre}</span>
                  {usuario.tipo === "Administrador" && <Nav.Link as={NavLink} to="/admin">Administración</Nav.Link>}
                  <Nav.Link href="#" onClick={salir}>Cerrar sesión</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={NavLink} to="/login">Iniciar sesión</Nav.Link>
                  <Nav.Link as={NavLink} to="/registro">Registrarse</Nav.Link>
                </>
              )}
              <Nav.Link as={NavLink} to="/carrito">Carrito ({totalItems})</Nav.Link>
            </Nav>
          </div>
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}

export default Menu
