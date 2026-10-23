import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Alert, Button, Container, Form } from "react-bootstrap"
import CampoFormulario from "../components/CampoFormulario"
import ResumenTotales from "../components/ResumenTotales"
import TablaItems from "../components/TablaItems"
import { useFormulario } from "../hooks/useFormulario"
import { useCarrito } from "../context/CarritoContext"
import { useSesion } from "../context/SesionContext"
import { obtenerProductoPorCodigo, crearOrden, descontarStock, actualizarUsuario } from "../data/datos"
import { calcularResumen } from "../utils/descuentos"
import { formatearPrecio, precioFinal } from "../utils/formato"
import { procesarPago } from "../servicios/pago"

const reglas = {
  nombre: { requerido: true, max: 50 },
  apellidos: { requerido: true, max: 100 },
  correo: { requerido: true, max: 100, correo: true },
  calle: { requerido: true, max: 100 },
  departamento: { max: 20 },
  region: { requerido: true, max: 100 },
  comuna: { requerido: true, max: 100 },
  indicaciones: { max: 300 }
}

function Checkout() {
  const { items, vaciar } = useCarrito()
  const { usuario, recargarUsuario } = useSesion()
  const navegar = useNavigate()
  const [resultadoSimulado, setResultadoSimulado] = useState("aprobado")
  const [procesando, setProcesando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const { valores, errores, cambiar, salirDelCampo, validarTodo } = useFormulario({
    nombre: usuario?.nombre || "",
    apellidos: usuario?.apellidos || "",
    correo: usuario?.correo || "",
    calle: usuario?.direccion || "",
    departamento: "",
    region: usuario?.region || "",
    comuna: usuario?.comuna || "",
    indicaciones: ""
  }, reglas)

  const lineas = items
    .map((item) => ({ producto: obtenerProductoPorCodigo(item.codigo), cantidad: item.cantidad }))
    .filter((linea) => linea.producto)
  const resumen = calcularResumen(lineas, usuario)

  if (lineas.length === 0) {
    return (
      <section className="seccion-titulo">
        <h1>Checkout</h1>
        <p>No hay productos en tu carrito.</p>
        <Link to="/productos" className="btn btn-primary boton-grande">Ver productos</Link>
      </section>
    )
  }

  const propiedades = (id) => ({ id, value: valores[id], onChange: cambiar, onBlur: salirDelCampo, error: errores[id] })

  const pagar = async (evento) => {
    evento.preventDefault()
    if (!validarTodo()) {
      setMensaje({ tipo: "danger", texto: "Revisa los campos marcados en rojo antes de continuar." })
      return
    }
    setProcesando(true)
    setMensaje(null)
    const respuesta = await procesarPago({ total: resumen.total, resultado: resultadoSimulado })
    const orden = crearOrden({
      estado: respuesta.aprobado ? "Pagada" : "Pago rechazado",
      correoUsuario: usuario ? usuario.correo : null,
      cliente: { nombre: valores.nombre.trim(), apellidos: valores.apellidos.trim(), correo: valores.correo.trim() },
      entrega: { calle: valores.calle.trim(), departamento: valores.departamento.trim(), region: valores.region.trim(), comuna: valores.comuna.trim(), indicaciones: valores.indicaciones.trim() },
      items: lineas.map(({ producto, cantidad }) => ({ codigo: producto.codigo, nombre: producto.nombre, precio: precioFinal(producto), imagen: producto.imagen, cantidad })),
      subtotal: resumen.subtotal,
      descuento: resumen.descuento,
      tortaGratis: resumen.tortaGratis,
      total: resumen.total
    })
    if (respuesta.aprobado) {
      descontarStock(items)
      if (usuario && resumen.tortaGratis.monto > 0) {
        actualizarUsuario(usuario.correo, { tortaGratisAnio: new Date().getFullYear() })
        recargarUsuario()
      }
      vaciar()
      navegar("/compra-exitosa/" + orden.numero)
    } else {
      navegar("/pago-error/" + orden.numero)
    }
  }

  return (
    <Container className="contenedor-carrito my-5">
      <Form noValidate onSubmit={pagar} className="formulario-tarjeta formulario-ancho">
        <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
          <div>
            <h2 className="mb-1">Carrito de compra</h2>
            <p>Completa la siguiente información</p>
          </div>
          <div className="total-destacado">Total a pagar: {formatearPrecio(resumen.total)}</div>
        </div>
        <TablaItems items={lineas.map(({ producto, cantidad }) => ({ ...producto, precio: precioFinal(producto), cantidad }))} />
        <ResumenTotales resumen={resumen} />
        <h2 className="mt-4">Información del cliente</h2>
        <div className="fila-doble">
          <CampoFormulario {...propiedades("nombre")} etiqueta="Nombre" maxLength={50} />
          <CampoFormulario {...propiedades("apellidos")} etiqueta="Apellidos" maxLength={100} />
        </div>
        <CampoFormulario {...propiedades("correo")} etiqueta="Correo" type="email" maxLength={100} />
        <h2 className="mt-4">Dirección de entrega de los productos</h2>
        <div className="fila-doble">
          <CampoFormulario {...propiedades("calle")} etiqueta="Calle" maxLength={100} />
          <CampoFormulario {...propiedades("departamento")} etiqueta="Departamento (opcional)" placeholder="Ej: 603" maxLength={20} />
        </div>
        <div className="fila-doble">
          <CampoFormulario {...propiedades("region")} etiqueta="Región" maxLength={100} />
          <CampoFormulario {...propiedades("comuna")} etiqueta="Comuna" maxLength={100} />
        </div>
        <CampoFormulario {...propiedades("indicaciones")} etiqueta="Indicaciones para la entrega (opcional)" as="textarea" rows={3} maxLength={300} placeholder="Ej: Entre calles, color del edificio, no tiene timbre." />
        <Form.Group controlId="simulacion-pago" className="mb-3">
          <Form.Label>Simulación de pago</Form.Label>
          <Form.Select value={resultadoSimulado} onChange={(e) => setResultadoSimulado(e.target.value)}>
            <option value="aprobado">Pago aprobado</option>
            <option value="rechazado">Pago rechazado</option>
          </Form.Select>
        </Form.Group>
        {mensaje && <Alert variant={mensaje.tipo} role="status">{mensaje.texto}</Alert>}
        <div className="text-end">
          <Button type="submit" variant="success" disabled={procesando}>{procesando ? "Procesando pago..." : "Pagar ahora " + formatearPrecio(resumen.total)}</Button>
        </div>
      </Form>
    </Container>
  )
}

export default Checkout
