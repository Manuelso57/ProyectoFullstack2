import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Alert, Button, Form } from "react-bootstrap"
import CampoFormulario from "../components/CampoFormulario"
import { useFormulario } from "../hooks/useFormulario"
import { obtenerCategorias, crearCategoria, actualizarCategoria } from "../data/datos"

const reglas = { nombre: { requerido: true, max: 50 } }

function CategoriaForm() {
  const { nombre } = useParams()
  const anterior = nombre ? decodeURIComponent(nombre) : null
  const existe = anterior ? obtenerCategorias().includes(anterior) : false
  const navegar = useNavigate()
  const [mensaje, setMensaje] = useState(null)
  const { valores, errores, cambiar, salirDelCampo, validarTodo } = useFormulario({ nombre: anterior ?? "" }, reglas)

  if (anterior && !existe) {
    return (
      <>
        <h1>Categoría no encontrada</h1>
        <Link to="/admin/categorias" className="btn btn-primary">Volver a categorías</Link>
      </>
    )
  }

  const guardar = (evento) => {
    evento.preventDefault()
    if (!validarTodo()) return
    const resultado = anterior ? actualizarCategoria(anterior, valores.nombre) : crearCategoria(valores.nombre)
    if (!resultado.ok) {
      setMensaje({ tipo: "danger", texto: resultado.error })
      return
    }
    navegar("/admin/categorias")
  }

  return (
    <>
      <h1>{anterior ? "Editar categoría" : "Nueva categoría"}</h1>
      <Form noValidate onSubmit={guardar} className="formulario-tarjeta">
        <CampoFormulario id="nombre" etiqueta="Nombre" maxLength={50} value={valores.nombre} onChange={cambiar} onBlur={salirDelCampo} error={errores.nombre} />
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">Guardar categoría</Button>
          <Link to="/admin/categorias" className="btn btn-outline-primary">Cancelar</Link>
        </div>
        {mensaje && <Alert variant={mensaje.tipo} className="mt-3 mb-0" role="status">{mensaje.texto}</Alert>}
      </Form>
    </>
  )
}

export default CategoriaForm
