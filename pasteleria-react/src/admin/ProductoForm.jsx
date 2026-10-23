import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Alert, Button, Form } from "react-bootstrap"
import CampoFormulario from "../components/CampoFormulario"
import { useFormulario } from "../hooks/useFormulario"
import { obtenerProductoPorCodigo, obtenerCategorias, crearProducto, actualizarProducto } from "../data/datos"

const reglas = {
  codigo: { requerido: true, min: 3 },
  nombre: { requerido: true, max: 100 },
  descripcion: { max: 500 },
  precio: { requerido: true, numerico: true, minValor: 0 },
  stock: { requerido: true, entero: true, minValor: 0 },
  stockCritico: { entero: true, minValor: 0 },
  descuentoOferta: { entero: true, minValor: 0, maxValor: 100 },
  categoria: { requerido: true, mensajeRequerido: "Selecciona una categoría." },
  imagen: { max: 300 }
}

function ProductoForm() {
  const { codigo } = useParams()
  const existente = codigo ? obtenerProductoPorCodigo(codigo) : null
  const navegar = useNavigate()
  const [mensaje, setMensaje] = useState(null)
  const categorias = obtenerCategorias()

  const { valores, errores, cambiar, salirDelCampo, validarTodo } = useFormulario({
    codigo: existente?.codigo ?? "",
    nombre: existente?.nombre ?? "",
    descripcion: existente?.descripcion ?? "",
    precio: existente ? String(existente.precio) : "",
    stock: existente ? String(existente.stock) : "",
    stockCritico: existente && existente.stockCritico != null ? String(existente.stockCritico) : "",
    descuentoOferta: existente && existente.descuentoOferta ? String(existente.descuentoOferta) : "",
    categoria: existente?.categoria ?? "",
    imagen: existente?.imagen ?? ""
  }, reglas)

  if (codigo && !existente) {
    return (
      <>
        <h1>Producto no encontrado</h1>
        <Link to="/admin/productos" className="btn btn-primary">Volver a productos</Link>
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
      codigo: valores.codigo.trim(),
      nombre: valores.nombre.trim(),
      descripcion: valores.descripcion.trim(),
      precio: Number(valores.precio),
      stock: parseInt(valores.stock),
      stockCritico: valores.stockCritico.trim() === "" ? null : parseInt(valores.stockCritico),
      descuentoOferta: valores.descuentoOferta.trim() === "" ? 0 : parseInt(valores.descuentoOferta),
      categoria: valores.categoria,
      imagen: valores.imagen.trim() || "/imagenes/logo.png"
    }
    const resultado = existente ? actualizarProducto(existente.codigo, datos) : crearProducto(datos)
    if (!resultado.ok) {
      setMensaje({ tipo: "danger", texto: resultado.error })
      return
    }
    navegar("/admin/productos")
  }

  return (
    <>
      <h1>{existente ? "Editar producto" : "Nuevo producto"}</h1>
      <Form noValidate onSubmit={guardar} className="formulario-tarjeta">
        <CampoFormulario {...propiedades("codigo")} etiqueta="Código producto" disabled={Boolean(existente)} />
        <CampoFormulario {...propiedades("nombre")} etiqueta="Nombre" maxLength={100} />
        <CampoFormulario {...propiedades("descripcion")} etiqueta="Descripción (opcional)" as="textarea" rows={3} maxLength={500} />
        <div className="fila-doble">
          <CampoFormulario {...propiedades("precio")} etiqueta="Precio" type="number" step="any" />
          <CampoFormulario {...propiedades("descuentoOferta")} etiqueta="Descuento de oferta % (opcional)" type="number" />
        </div>
        <div className="fila-doble">
          <CampoFormulario {...propiedades("stock")} etiqueta="Stock" type="number" />
          <CampoFormulario {...propiedades("stockCritico")} etiqueta="Stock crítico (opcional)" type="number" />
        </div>
        <CampoFormulario {...propiedades("categoria")} etiqueta="Categoría" as="select">
          <option value="">-- Seleccione la categoría --</option>
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>{categoria}</option>
          ))}
        </CampoFormulario>
        <CampoFormulario {...propiedades("imagen")} etiqueta="Imagen (opcional, ruta o URL)" placeholder="/imagenes/nombre.png" />
        <div className="d-flex gap-2">
          <Button type="submit" variant="primary">Guardar producto</Button>
          <Link to="/admin/productos" className="btn btn-outline-primary">Cancelar</Link>
        </div>
        {mensaje && <Alert variant={mensaje.tipo} className="mt-3 mb-0" role="status">{mensaje.texto}</Alert>}
      </Form>
    </>
  )
}

export default ProductoForm
