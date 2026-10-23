export const blogs = [
  {
    id: "1",
    titulo: "El día que hicimos historia con Guinness",
    resumen: "En 1995 Pastelería Mil Sabores participó en la creación de la torta más grande del mundo, un hito que hasta hoy es parte de nuestra historia.",
    parrafos: [
      "Corría 1995 cuando Pastelería Mil Sabores se propuso un desafío que marcaría su historia para siempre, participar en la creación de la torta más grande jamás registrada por el libro Guinness de los récords.",
      "El proyecto reunió a decenas de reposteros trabajando sin descanso durante días, combinando toneladas de bizcocho, crema y decoración para lograr una obra que sorprendió al país entero.",
      "Hoy, ese hito sigue siendo parte de nuestra identidad, nos recuerda que la dedicación y el trabajo en equipo pueden transformar una simple torta en un recuerdo inolvidable para toda una comunidad.",
      "Cada vez que preparamos una torta especial para tu celebración, llevamos ese mismo espíritu, hacer de cada pedido un pequeño gran acontecimiento."
    ]
  },
  {
    id: "2",
    titulo: "Sin gluten y sin azúcar: repostería para todos",
    resumen: "Descubre cómo desarrollamos nuestra línea de productos sin gluten y sin azúcar, pensada para que nadie se quede sin disfrutar un buen postre.",
    parrafos: [
      "Sabemos que la dulzura no debería tener restricciones. Por eso, un grupo de estudiantes de gastronomía trabajó junto a nuestros maestros pasteleros para desarrollar una línea completa de productos sin gluten y sin azúcar.",
      "El mayor desafío fue lograr la misma textura esponjosa y el mismo sabor intenso que caracteriza a nuestras recetas tradicionales, pero reemplazando harinas e ingredientes por alternativas cuidadosamente seleccionadas.",
      "Después de meses de pruebas nacieron nuestro brownie sin gluten, el pan sin gluten y la torta y cheesecake sin azúcar, productos pensados para que nadie tenga que quedarse fuera de una buena mesa.",
      "Este proyecto también fue una oportunidad de aprendizaje real para nuestros estudiantes, quienes aplicaron conocimientos técnicos de nutrición y repostería en un producto final que hoy disfrutan miles de clientes."
    ]
  }
]

export const obtenerBlogs = () => blogs

export const obtenerBlogPorId = (id) => blogs.find((blog) => blog.id === id) || null
