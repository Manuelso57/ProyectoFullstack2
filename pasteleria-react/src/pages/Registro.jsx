import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Alert, Button, Form } from "react-bootstrap"
import CampoFormulario from "../components/CampoFormulario"
import { useFormulario } from "../hooks/useFormulario"
import { useSesion } from "../context/SesionContext"

const reglas = {
  nombre: { requerido: true, max: 50 },
  apellidos: { requerido: true, max: 100 },
  run: { requerido: true, min: 7, max: 9, run: true },
  correo: { requerido: true, max: 100, correo: true },
  password: { requerido: true, min: 4, max: 10 },
  confirmarPassword: { requerido: true, coincideCon: "password" },
  fechaNacimiento: { fechaNoFutura: true },
  telefono: { max: 15 },
  region: { requerido: true, max: 100 },
  comuna: { requerido: true, max: 100 },
  direccion: { requerido: true, max: 300 },
  codigoDescuento: { max: 20 }
}

const valoresIniciales = { nombre: "", apellidos: "", run: "", correo: "", password: "", confirmarPassword: "", fechaNacimiento: "", telefono: "", region: "", comuna: "", direccion: "", codigoDescuento: "" }

function Registro() {
  const { valores, errores, cambiar, salirDelCampo, validarTodo } = useFormulario(valoresIniciales, reglas)
  const { registrar } = useSesion()
  const [mensaje, setMensaje] = useState(null)
  const navegar = useNavigate()

  const propiedades = (id) => ({ id, value: valores[id], onChange: cambiar, onBlur: salirDelCampo, error: errores[id] })

  const enviar = (evento) => {
    evento.preventDefault()
    if (!validarTodo()) {
      setMensaje({ tipo: "danger", texto: "Revisa los campos marcados en rojo antes de continuar." })
      return
    }
    const resultado = registrar({
      nombre: valores.nombre.trim(),
      apellidos: valores.apellidos.trim(),
      run: valores.run,
      correo: valores.correo,
      password: valores.password,
      fechaNacimiento: valores.fechaNacimiento,
      telefono: valores.telefono.trim(),
      region: valores.region.trim(),
      comuna: valores.comuna.trim(),
      direccion: valores.direccion.trim(),
      tipo: "Cliente",
      codigoFelices50: valores.codigoDescuento.trim().toUpperCase() === "FELICES50"
    })
    if (!resultado.ok) {
      setMensaje({ tipo: "danger", texto: resultado.error })
      return
    }
    navegar("/")
  }

  return (
    <>
      <section className="seccion-titulo">
        <h1>Crear cuenta</h1>
        <p>Mayores de 50 años reciben 50% de descuento automático.</p>
      </section>
      <section className="contenedor-formulario">
        <Form noValidate onSubmit={enviar} className="formulario-tarjeta">
          <CampoFormulario {...propiedades("nombre")} etiqueta="Nombre" maxLength={50} />
          <CampoFormulario {...propiedades("apellidos")} etiqueta="Apellidos" maxLength={100} />
          <CampoFormulario {...propiedades("run")} etiqueta="RUN" maxLength={9} placeholder="Ej: 123456785" />
          <CampoFormulario {...propiedades("correo")} etiqueta="Correo electrónico" type="email" maxLength={100} placeholder="nombre@duoc.cl" />
          <CampoFormulario {...propiedades("password")} etiqueta="Contraseña" type="password" />
          <CampoFormulario {...propiedades("confirmarPassword")} etiqueta="Confirmar contraseña" type="password" />
          <CampoFormulario {...propiedades("fechaNacimiento")} etiqueta="Fecha de nacimiento" type="date" />
          <CampoFormulario {...propiedades("telefono")} etiqueta="Teléfono (opcional)" type="tel" maxLength={15} />
          <div className="fila-doble">
            <CampoFormulario {...propiedades("region")} etiqueta="Región" maxLength={100} />
            <CampoFormulario {...propiedades("comuna")} etiqueta="Comuna" maxLength={100} />
          </div>
          <CampoFormulario {...propiedades("direccion")} etiqueta="Dirección" maxLength={300} />
          <CampoFormulario {...propiedades("codigoDescuento")} etiqueta="Código de descuento (opcional)" maxLength={20} placeholder="FELICES50" />
          <Button type="submit" variant="primary" className="boton-grande">Registrarme</Button>
          {mensaje && <Alert variant={mensaje.tipo} className="mt-3 mb-0" role="status">{mensaje.texto}</Alert>}
        </Form>
      </section>
    </>
  )
}

export default Registro
