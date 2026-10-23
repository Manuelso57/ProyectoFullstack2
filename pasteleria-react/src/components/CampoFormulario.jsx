import { Form } from "react-bootstrap"

function CampoFormulario({ id, etiqueta, error, ...resto }) {
  return (
    <Form.Group controlId={id} className="mb-3">
      <Form.Label>{etiqueta}</Form.Label>
      <Form.Control name={id} isInvalid={Boolean(error)} {...resto} />
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
  )
}

export default CampoFormulario
