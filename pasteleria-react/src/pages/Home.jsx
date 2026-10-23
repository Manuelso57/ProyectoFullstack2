import { Link } from "react-router-dom"
import TarjetaProducto from "../components/TarjetaProducto"
import { useCarrito } from "../context/CarritoContext"
import { obtenerProductos, obtenerCategorias } from "../data/datos"

function Home() {
  const { agregar } = useCarrito()
  const productos = obtenerProductos()
  const categorias = obtenerCategorias()
  const destacados = productos.slice(0, 4)

  return (
    <>
      <section className="hero d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 gap-md-5 text-center py-5 px-3">
        <div className="hero-texto">
          <h1>50 años endulzando la vida de nuestros clientes</h1>
          <p>Desde 1995 preparamos tortas y postres con recetas tradicionales chilenas, Descubre nuestra tienda online.</p>
          <div className="codigo-promocion">
            <p>Usa el codigo FELICES50 para un 10% de descuento en cualquier compra</p>
          </div>
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
            <Link to="/productos" className="btn btn-primary boton-grande">Ver productos</Link>
            <Link to="/nosotros" className="btn btn-primary boton-grande">Sobre nosotros</Link>
          </div>
        </div>
        <div className="hero-imagen">
          <img src="/imagenes/logo.png" height="250" alt="Logo Mil Sabores" />
        </div>
      </section>
      <section className="seccion-titulo">
        <h2>Categorías</h2>
      </section>
      <section className="grilla-productos">
        {categorias.map((categoria) => {
          const ejemplo = productos.find((p) => p.categoria === categoria)
          return (
            <Link key={categoria} to={"/categorias/" + encodeURIComponent(categoria)} className="tarjeta-producto text-decoration-none">
              <span className="tarjeta-producto__imagen">
                <img src={ejemplo ? ejemplo.imagen : "/imagenes/logo.png"} alt={categoria} />
              </span>
              <h3>{categoria}</h3>
            </Link>
          )
        })}
      </section>
      <section className="seccion-titulo">
        <h2>Destacados</h2>
      </section>
      <section className="grilla-productos">
        {destacados.map((producto) => (
          <TarjetaProducto key={producto.codigo} producto={producto} onAgregar={agregar} />
        ))}
      </section>
    </>
  )
}

export default Home
