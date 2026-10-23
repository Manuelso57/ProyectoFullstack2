import { Table } from "react-bootstrap"
import { formatearPrecio } from "../utils/formato"

function TablaItems({ items }) {
  return (
    <Table responsive size="sm" className="align-middle">
      <thead>
        <tr><th>Imagen</th><th>Nombre</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.codigo}>
            <td><img src={item.imagen} alt={item.nombre} className="miniatura" /></td>
            <td>{item.nombre}</td>
            <td>{formatearPrecio(item.precio)}</td>
            <td>{item.cantidad}</td>
            <td>{formatearPrecio(item.precio * item.cantidad)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default TablaItems
