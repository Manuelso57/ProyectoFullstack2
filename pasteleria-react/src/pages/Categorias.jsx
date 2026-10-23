import { Link, useParams } from "react-router-dom"
import TarjetaProducto from "../components/TarjetaProducto"
import { useCarrito } from "../context/CarritoContext"
import { obtenerProductos, obtenerCategorias } from "../data/datos"

function Categorias() {
  const { nombre } = useParams()
  const { agregar } = useCarrito()
  const productos = obtenerProductos()
  const categorias = obtenerCategorias()
  const seleccionada = nombre ? decodeURIComponent(nombre) : null
  const mostradas = seleccionada ? categorias.filter((categoria) => categoria === seleccionada) : categorias

  return (
    <>
      <section className="seccion-titulo">
        <h1>Categorías</h1>
        <p>Elige una categoría para ver sus productos.</p>
      </section>
      <nav aria-label="Categorías" className="grilla-productos pb-0">
        {categorias.map((categoria) => {
          const ejemplo = productos.find((p) => p.categoria === categoria)
          return (
            <Link key={categoria} to={"/categorias/" + encodeURIComponent(categoria)} className={"tarjeta-producto text-decoration-none" + (categoria === seleccionada ? " tarjeta-activa" : "")}>
              <span className="tarjeta-producto__imagen">
                <img src={ejemplo ? ejemplo.imagen : "/imagenes/logo.png"} alt="" />
              </span>
              <span className="fw-bold">{categoria}</span>
            </Link>
          )
        })}
      </nav>
      {seleccionada && mostradas.length === 0 && (
        <p className="text-center mt-4" role="alert">La categoría "{seleccionada}" no existe.</p>
      )}
      {mostradas.map((categoria) => (
        <section key={categoria} aria-label={"Productos de " + categoria}>
          <div className="seccion-titulo">
            <h2>{categoria}</h2>
          </div>
          <div className="grilla-productos">
            {productos.filter((p) => p.categoria === categoria).map((producto) => (
              <TarjetaProducto key={producto.codigo} producto={producto} onAgregar={agregar} />
            ))}
          </div>
        </section>
      ))}
    </>
  )
}

export default Categorias
