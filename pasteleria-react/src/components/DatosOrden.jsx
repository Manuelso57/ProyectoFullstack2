import { Form } from "react-bootstrap"
import TablaItems from "./TablaItems"
import { formatearPrecio } from "../utils/formato"

function DatosOrden({ orden }) {
  return (
    <>
      <div className="fila-doble">
        <Form.Group className="mb-3"><Form.Label>Nombre</Form.Label><Form.Control readOnly value={orden.cliente.nombre} /></Form.Group>
        <Form.Group className="mb-3"><Form.Label>Apellidos</Form.Label><Form.Control readOnly value={orden.cliente.apellidos} /></Form.Group>
      </div>
      <Form.Group className="mb-3"><Form.Label>Correo</Form.Label><Form.Control readOnly value={orden.cliente.correo} /></Form.Group>
      <h2 className="h4">Dirección de entrega de los productos</h2>
      <div className="fila-doble">
        <Form.Group className="mb-3"><Form.Label>Calle</Form.Label><Form.Control readOnly value={orden.entrega.calle} /></Form.Group>
        <Form.Group className="mb-3"><Form.Label>Departamento</Form.Label><Form.Control readOnly value={orden.entrega.departamento} /></Form.Group>
      </div>
      <div className="fila-doble">
        <Form.Group className="mb-3"><Form.Label>Región</Form.Label><Form.Control readOnly value={orden.entrega.region} /></Form.Group>
        <Form.Group className="mb-3"><Form.Label>Comuna</Form.Label><Form.Control readOnly value={orden.entrega.comuna} /></Form.Group>
      </div>
      <Form.Group className="mb-3"><Form.Label>Indicaciones para la entrega</Form.Label><Form.Control as="textarea" rows={2} readOnly value={orden.entrega.indicaciones} /></Form.Group>
      <TablaItems items={orden.items} />
      <div className="total-destacado text-center mb-3">Total pagado: {formatearPrecio(orden.total)}</div>
    </>
  )
}

export default DatosOrden
