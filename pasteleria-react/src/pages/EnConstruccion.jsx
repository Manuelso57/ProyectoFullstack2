import { Link } from "react-router-dom"

function EnConstruccion() {
  return (
    <section className="seccion-titulo">
      <h1>Página en construcción</h1>
      <p>Esta sección estará disponible pronto.</p>
      <Link to="/" className="btn btn-primary boton-grande">Volver al inicio</Link>
    </section>
  )
}

export default EnConstruccion
