import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Container, Row, Col, Form } from "react-bootstrap"
import TarjetaProducto from "../components/TarjetaProducto"
import { useCarrito } from "../context/CarritoContext"
import { obtenerProductos, obtenerCategorias } from "../data/datos"
import { normalizarTexto } from "../utils/formato"

function Productos() {
  const [parametros] = useSearchParams()
  const [busqueda, setBusqueda] = useState(parametros.get("q") || "")
  const [categoria, setCategoria] = useState(parametros.get("categoria") || "")
  const { agregar } = useCarrito()
  const productos = obtenerProductos()
  const categorias = obtenerCategorias()

  const filtrados = productos.filter((producto) => {
    const coincideTexto = normalizarTexto(producto.nombre + " " + producto.descripcion).includes(normalizarTexto(busqueda))
    const coincideCategoria = categoria === "" || producto.categoria === categoria
    return coincideTexto && coincideCategoria
  })

  return (
    <>
      <section className="seccion-titulo">
        <h1>Nuestros productos</h1>
        <p>Explora el catálogo completo de Pastelería Mil Sabores.</p>
      </section>
      <Container className="mb-4">
        <Row className="g-3 justify-content-center">
          <Col md={6} lg={5}>
            <Form.Group controlId="filtro-busqueda">
              <Form.Label>Buscar producto</Form.Label>
              <Form.Control type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Ej: chocolate" />
            </Form.Group>
          </Col>
          <Col md={4} lg={3}>
            <Form.Group controlId="filtro-categoria">
              <Form.Label>Categoría</Form.Label>
              <Form.Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Todas</option>
                {categorias.map((nombre) => (
                  <option key={nombre} value={nombre}>{nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Container>
      {filtrados.length === 0 ? (
        <p className="text-center pb-5" role="alert">No se encontraron productos con esos filtros.</p>
      ) : (
        <section className="grilla-productos">
          {filtrados.map((producto) => (
            <TarjetaProducto key={producto.codigo} producto={producto} onAgregar={agregar} />
          ))}
        </section>
      )}
    </>
  )
}

export default Productos
