import TarjetaProducto from "../components/TarjetaProducto"
import { useCarrito } from "../context/CarritoContext"
import { obtenerProductos } from "../data/datos"
import { estaEnOferta } from "../utils/formato"

function Ofertas() {
  const { agregar } = useCarrito()
  const ofertas = obtenerProductos().filter(estaEnOferta)

  return (
    <>
      <section className="seccion-titulo">
        <h1>Ofertas</h1>
        <p>Aprovecha los productos con descuento especial.</p>
      </section>
      {ofertas.length === 0 ? (
        <p className="text-center pb-5" role="alert">No hay productos en oferta por ahora.</p>
      ) : (
        <section className="grilla-productos">
          {ofertas.map((producto) => (
            <TarjetaProducto key={producto.codigo} producto={producto} onAgregar={agregar} />
          ))}
        </section>
      )}
    </>
  )
}

export default Ofertas
