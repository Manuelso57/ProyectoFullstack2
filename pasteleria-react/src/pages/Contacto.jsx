import { useState } from "react"
import { Alert, Button, Form } from "react-bootstrap"
import CampoFormulario from "../components/CampoFormulario"
import { useFormulario } from "../hooks/useFormulario"

const reglas = {
  nombre: { requerido: true, max: 100 },
  correo: { max: 100, correo: true },
  mensaje: { requerido: true, max: 500 }
}

function Contacto() {
  const { valores, errores, cambiar, salirDelCampo, validarTodo, reiniciar } = useFormulario({ nombre: "", correo: "", mensaje: "" }, reglas)
  const [mensaje, setMensaje] = useState(null)

  const propiedades = (id) => ({ id, value: valores[id], onChange: cambiar, onBlur: salirDelCampo, error: errores[id] })

  const enviar = (evento) => {
    evento.preventDefault()
    if (!validarTodo()) {
      setMensaje({ tipo: "danger", texto: "Revisa los campos marcados en rojo antes de continuar." })
      return
    }
    setMensaje({ tipo: "success", texto: "¡Listo! Tu mensaje fue enviado correctamente." })
    reiniciar()
  }

  return (
    <>
      <section className="seccion-titulo">
        <h1>Contáctanos</h1>
        <p>Escríbenos para pedidos especiales o algunas dudas sobre productos.</p>
      </section>
      <section className="contenedor-formulario">
        <Form noValidate onSubmit={enviar} className="formulario-tarjeta">
          <CampoFormulario {...propiedades("nombre")} etiqueta="Nombre completo" maxLength={100} />
          <CampoFormulario {...propiedades("correo")} etiqueta="Correo" type="email" maxLength={100} placeholder="nombre@duoc.cl" />
          <CampoFormulario {...propiedades("mensaje")} etiqueta="Mensaje" as="textarea" rows={6} maxLength={500} placeholder="Escribe tu mensaje aquí" />
          <Button type="submit" variant="primary" className="boton-grande">Enviar mensaje</Button>
          {mensaje && <Alert variant={mensaje.tipo} className="mt-3 mb-0" role="status">{mensaje.texto}</Alert>}
        </Form>
      </section>
    </>
  )
}

export default Contacto
