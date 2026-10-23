import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Alert, Button, Form } from "react-bootstrap"
import CampoFormulario from "../components/CampoFormulario"
import { useFormulario } from "../hooks/useFormulario"
import { useSesion } from "../context/SesionContext"

const reglas = {
  correo: { requerido: true, max: 100, correo: true },
  password: { requerido: true, min: 4, max: 10 }
}

function Login() {
  const { valores, errores, cambiar, salirDelCampo, validarTodo } = useFormulario({ correo: "", password: "" }, reglas)
  const { iniciarSesion } = useSesion()
  const [mensaje, setMensaje] = useState(null)
  const navegar = useNavigate()

  const enviar = (evento) => {
    evento.preventDefault()
    if (!validarTodo()) {
      setMensaje({ tipo: "danger", texto: "Revisa los campos marcados en rojo antes de continuar." })
      return
    }
    const resultado = iniciarSesion(valores.correo, valores.password)
    if (!resultado.ok) {
      setMensaje({ tipo: "danger", texto: resultado.error })
      return
    }
    navegar(resultado.usuario.tipo === "Administrador" ? "/admin" : "/")
  }

  return (
    <>
      <section className="seccion-titulo">
        <h1>Inicio de sesión</h1>
        <p>Ingresa tus datos para acceder a tu cuenta.</p>
      </section>
      <section className="contenedor-formulario">
        <Form noValidate onSubmit={enviar} className="formulario-tarjeta">
          <CampoFormulario id="correo" etiqueta="Correo electrónico" type="email" maxLength={100} placeholder="nombre@duoc.cl" value={valores.correo} onChange={cambiar} onBlur={salirDelCampo} error={errores.correo} />
          <CampoFormulario id="password" etiqueta="Contraseña" type="password" value={valores.password} onChange={cambiar} onBlur={salirDelCampo} error={errores.password} />
          <Button type="submit" variant="primary" className="boton-grande">Iniciar sesión</Button>
          {mensaje && <Alert variant={mensaje.tipo} className="mt-3 mb-0" role="status">{mensaje.texto}</Alert>}
          <p className="text-center mt-3 mb-0">¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
        </Form>
      </section>
    </>
  )
}

export default Login
