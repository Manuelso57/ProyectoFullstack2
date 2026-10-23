import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Alert, Button, Form } from "react-bootstrap"
import CampoFormulario from "../components/CampoFormulario"
import { useFormulario } from "../hooks/useFormulario"
import { obtenerUsuarioPorCorreo, obtenerUsuarios, crearUsuario, actualizarUsuario } from "../data/datos"

const reglasBase = {
  run: { requerido: true, min: 7, max: 9, run: true },
  nombre: { requerido: true, max: 50 },
  apellidos: { requerido: true, max: 100 },
  correo: { requerido: true, max: 100, correo: true },
  fechaNacimiento: { fechaNoFutura: true },
  tipo: { requerido: true, mensajeRequerido: "Selecciona un tipo de usuario." },
  region: { requerido: true, max: 100 },
  comuna: { requerido: true, max: 100 },
  direccion: { requerido: true, max: 300 }
}

const limpiarRun = (run) => run.replace(/\./g, "").replace(/-/g, "").trim().toUpperCase()

function UsuarioForm() {
  const { correo } = useParams()
  const existente = correo ? obtenerUsuarioPorCorreo(decodeURIComponent(correo)) : null
  const navegar = useNavigate()
  const [mensaje, setMensaje] = useState(null)
  const reglas = { ...reglasBase, password: existente ? { min: 4, max: 10 } : { requerido: true, min: 4, max: 10 } }

  const { valores, errores, cambiar, salirDelCampo, validarTodo } = useFormulario({
    run: existente?.run ?? "",
    nombre: existente?.nombre ?? "",
    apellidos: existente?.apellidos ?? "",
    correo: existente?.correo ?? "",
    password: "",
    fechaNacimiento: existente?.fechaNacimiento ?? "",
    tipo: existente?.tipo ?? "Cliente",
    region: existente?.region ?? "",
    comuna: existente?.comuna ?? "",
    direccion: existente?.direccion ?? ""
  }, reglas)

  if (correo && !existente) {
    return (
      <>
        <h1>Usuario no encontrado</h1>
        <Link to="/admin/usuarios" className="btn btn-primary">Volver a usuarios</Link>
      </>
    )
  }

  const propiedades = (id) => ({ id, value: valores[id], onChange: cambiar, onBlur: salirDelCampo, error: errores[id] })

  const guardar = (evento) => {
    evento.preventDefault()
    if (!validarTodo()) {
      setMensaje({ tipo: "danger", texto: "Revisa los campos marcados en rojo antes de continuar." })
      return
    }
    const datos = {
      run: limpiarRun(valores.run),
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      fechaNacimiento: valores.fechaNacimiento,
      tipo: valores.tipo,
      region: valores.region.trim(),
      comuna: valores.comuna.trim(),
      direccion: valores.direccion.trim()
    }
    let resultado
    if (existente) {
      if (obtenerUsuarios().some((u) => u.run === datos.run && u.correo !== existente.correo)) {
        setMensaje({ tipo: "danger", texto: "Ya existe una cuenta registrada con ese RUN." })
        return
      }
      resultado = actualizarUsuario(existente.correo, { ...datos, password: valores.password || existente.password })
    } else {
      resultado = crearUsuario({ ...datos, correo: valores.correo, password: valores.password })
    }
    if (!resultado.ok) {
      setMensaje({ tipo: "danger", texto: resultado.error })
      return
    }
    navegar("/admin/usuarios")
  }

  return (
    <>
      <h1>{existente ? "Editar usuario" : "Nuevo usuario"}</h1>
      <Form noValidate onSubmit={guardar} className="formulario-tarjeta">
        <CampoFormulario {...propiedades("run")} etiqueta="RUN" maxLength={9} placeholder="Ej: 123456785" />
        <div className="fila-doble">
          <CampoFormulario {...propiedades("nombre")} etiqueta="Nombre" maxLength={50} />
          <CampoFormulario {...propiedades("apellidos")} etiqueta="Apellidos" maxLength={100} />
        </div>
        <CampoFormulario {...propiedades("correo")} etiqueta="Correo electrónico" type="email" maxLength={100} disabled={Boolean(existente)} />
        <CampoFormulario {...propiedades("password")} etiqueta={existente ? "Contraseña (dejar en blanco para no cambiarla)" : "Contraseña"} type="password" />
        <CampoFormulario {...propiedades("fechaNacimiento")} etiqueta="Fecha de nacimiento (opcional)" type="date" />
        <CampoFormulario {...propiedades("tipo")} etiqueta="Tipo de usuario" as="select">
          <option value="">-- Seleccione el tipo --</option>
          <option value="Administrador">Administrador</option>
          <option value="Cliente">Cliente</option>
        </CampoFormulario>
        <div className="fila-doble">
          <CampoFormulario {...propiedades("region")} etiqueta="Región" maxLength={100} />
          <CampoFormulario {...propiedades("comuna")} etiqueta="Comuna" maxLength={100} />
        </div>
        <CampoFormulario {...propiedades("direccion")} etiqueta="Dirección" maxLength={300} />
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">Guardar usuario</Button>
          <Link to="/admin/usuarios" className="btn btn-outline-primary">Cancelar</Link>
        </div>
        {mensaje && <Alert variant={mensaje.tipo} className="mt-3 mb-0" role="status">{mensaje.texto}</Alert>}
      </Form>
    </>
  )
}

export default UsuarioForm
