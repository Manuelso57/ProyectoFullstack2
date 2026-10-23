import { Link } from "react-router-dom"
import { obtenerBlogs } from "../data/blogs"

function Blogs() {
  return (
    <>
      <section className="seccion-titulo">
        <h1>Datos sobre Pastelería Mil Sabores y sus logros</h1>
      </section>
      <section className="lista-blogs">
        {obtenerBlogs().map((blog) => (
          <article key={blog.id} className="tarjeta-blog">
            <h2>{blog.titulo}</h2>
            <p>{blog.resumen}</p>
            <Link to={"/blogs/" + blog.id} className="btn btn-primary">Ver más</Link>
          </article>
        ))}
      </section>
    </>
  )
}

export default Blogs
