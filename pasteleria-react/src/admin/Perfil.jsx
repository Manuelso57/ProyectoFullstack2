import { useState } from "react"
import { Alert, Button, Form } from "react-bootstrap"
import CampoFormulario from "../components/CampoFormulario"
import { useFormulario } from "../hooks/useFormulario"
import { useSesion } from "../context/SesionContext"
import { actualizarUsuario } from "../data/datos"

const reglas = {
  nombre: { requerido: true, max: 50 },
  apellidos: { requerido: true, max: 100 },
  telefono: { max: 15 },
  region: { requerido: true, max: 100 },
  comuna: { requerido: true, max: 100 },
  direccion: { requerido: true, max: 300 }
}

function Perfil() {
  const { usuario, recargarUsuario } = useSesion()
  const [mensaje, setMensaje] = useState(null)
  const { valores, errores, cambiar, salirDelCampo, validarTodo } = useFormulario({
    nombre: usuario.nombre,
    apellidos: usuario.apellidos,
    telefono: usuario.telefono || "",
    region: usuario.region,
    comuna: usuario.comuna,
    direccion: usuario.direccion
  }, reglas)

  const propiedades = (id) => ({ id, value: valores[id], onChange: cambiar, onBlur: salirDelCampo, error: errores[id] })

  const guardar = (evento) => {
    evento.preventDefault()
    if (!validarTodo()) {
      setMensaje({ tipo: "danger", texto: "Revisa los campos marcados en rojo antes de continuar." })
      return
    }
    actualizarUsuario(usuario.correo, {
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      telefono: valores.telefono.trim(),
      region: valores.region.trim(),
      comuna: valores.comuna.trim(),
      direccion: valores.direccion.trim()
    })
    recargarUsuario()
    setMensaje({ tipo: "success", texto: "Tu perfil se actualizó correctamente." })
  }

  return (
    <>
      <h1>Perfil</h1>
      <p>{usuario.correo} · {usuario.tipo}</p>
      <Form noValidate onSubmit={guardar} className="formulario-tarjeta">
        <CampoFormulario {...propiedades("nombre")} etiqueta="Nombre" maxLength={50} />
        <CampoFormulario {...propiedades("apellidos")} etiqueta="Apellidos" maxLength={100} />
        <CampoFormulario {...propiedades("telefono")} etiqueta="Teléfono (opcional)" type="tel" maxLength={15} />
        <div className="fila-doble">
          <CampoFormulario {...propiedades("region")} etiqueta="Región" maxLength={100} />
          <CampoFormulario {...propiedades("comuna")} etiqueta="Comuna" maxLength={100} />
        </div>
        <CampoFormulario {...propiedades("direccion")} etiqueta="Dirección" maxLength={300} />
        <Button type="submit" variant="primary">Guardar cambios</Button>
        {mensaje && <Alert variant={mensaje.tipo} className="mt-3 mb-0" role="status">{mensaje.texto}</Alert>}
      </Form>
    </>
  )
}

export default Perfil
