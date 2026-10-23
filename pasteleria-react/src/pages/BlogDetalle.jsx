import { Link, useParams } from "react-router-dom"
import { obtenerBlogPorId } from "../data/blogs"

function BlogDetalle() {
  const { id } = useParams()
  const blog = obtenerBlogPorId(id)

  if (!blog) {
    return (
      <section className="seccion-titulo">
        <h1>Blog no encontrado</h1>
        <Link to="/blogs" className="btn btn-primary boton-grande">Volver a blogs</Link>
      </section>
    )
  }

  return (
    <section className="detalle-blog">
      <h1>{blog.titulo}</h1>
      {blog.parrafos.map((parrafo) => (
        <p key={parrafo}>{parrafo}</p>
      ))}
      <Link to="/blogs" className="btn btn-primary boton-grande">Volver a blogs</Link>
    </section>
  )
}

export default BlogDetalle
