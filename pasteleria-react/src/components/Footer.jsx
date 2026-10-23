import { Link, useLocation } from "react-router-dom"

function Footer() {
  const { pathname } = useLocation()

  if (pathname !== "/") {
    return (
      <footer className="pie-pagina pie-pagina--simple">
        <p>Pastelería Mil Sabores</p>
      </footer>
    )
  }

  return (
    <footer className="pie-pagina pie-pagina--columnas">
      <div className="pie-columna">
        <h3>Pastelería Mil Sabores</h3>
        <p>Repostería chilena con 50 años de tradición, innovación y dulzura en cada torta.</p>
      </div>
      <div className="pie-columna">
        <h3>Explorar</h3>
        <ul>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
          <li><Link to="/blogs">Blogs</Link></li>
        </ul>
      </div>
      <div className="pie-columna">
        <h3>Cuenta</h3>
        <ul>
          <li><Link to="/login">Iniciar sesión</Link></li>
          <li><Link to="/registro">Registrarse</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
        </ul>
      </div>
    </footer>
  )
}

export default Footer
