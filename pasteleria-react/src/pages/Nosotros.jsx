import { Container, Row, Col } from "react-bootstrap"

function Nosotros() {
  return (
    <>
      <section className="seccion-titulo">
        <h1>Somos Pastelería Mil Sabores</h1>
      </section>
      <Container className="mb-5">
        <div className="bloque-claro">
          <p className="mb-0">Celebramos 50 años como un referente de la repostería chilena. Somos famosos por haber participado en un récord Guinness en 1995, cuando colaboramos en la creación de la torta más grande del mundo, y hoy renovamos nuestra tienda online para ofrecerte una experiencia de compra moderna y accesible.</p>
        </div>
        <Row className="g-3 mt-2">
          <Col md={6}>
            <div className="bloque-claro h-100">
              <h2>Misión</h2>
              <p className="mb-0">Ofrecer una experiencia dulce y memorable a nuestros clientes, proporcionando tortas y productos de repostería de alta calidad para todas las ocasiones, mientras celebramos nuestras raíces históricas y fomentamos la creatividad en la repostería.</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="bloque-claro h-100">
              <h2>Visión</h2>
              <p className="mb-0">Convertirnos en la tienda online líder de productos de repostería en Chile, conocida por nuestra innovación, calidad y el impacto positivo en la comunidad, especialmente en la formación de nuevos talentos en gastronomía.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Nosotros
