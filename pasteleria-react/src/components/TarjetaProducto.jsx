import { Link } from "react-router-dom"
import { Card, Button } from "react-bootstrap"
import { formatearPrecio, precioFinal, estaEnOferta } from "../utils/formato"

function TarjetaProducto({ producto, onAgregar }) {
  const sinStock = producto.stock <= 0
  const enOferta = estaEnOferta(producto)

  return (
    <Card className="tarjeta-producto">
      {enOferta && <span className="insignia-oferta">-{producto.descuentoOferta}%</span>}
      <Link to={"/productos/" + producto.codigo} className="tarjeta-producto__imagen">
        <img src={producto.imagen} alt={producto.nombre} />
      </Link>
      <span className="tarjeta-producto__categoria">{producto.categoria}</span>
      <Card.Title as="h3">{producto.nombre}</Card.Title>
      <span className="tarjeta-producto__precio">
        {enOferta && <span className="precio-original">{formatearPrecio(producto.precio)}</span>}
        <span>{formatearPrecio(precioFinal(producto))}</span>
      </span>
      <div className="tarjeta-producto__acciones">
        <Link to={"/productos/" + producto.codigo} className="btn btn-outline-primary">Ver detalle</Link>
        <Button variant="primary" disabled={sinStock} onClick={() => onAgregar(producto.codigo)}>
          {sinStock ? "Sin stock" : "Añadir"}
        </Button>
      </div>
    </Card>
  )
}

export default TarjetaProducto
