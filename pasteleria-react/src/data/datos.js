const CLAVE_PRODUCTOS = "mil_sabores_productos"

const productosIniciales = [
  { codigo: "TC001", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada de Chocolate", precio: 45000, stock: 20, stockCritico: 5, descuentoOferta: 20, imagen: "/imagenes/torta_chocolate.png", descripcion: "Deliciosa torta de chocolate con capas de ganache y un toque de avellanas. Personalizable con mensajes especiales." },
  { codigo: "TC002", categoria: "Tortas Cuadradas", nombre: "Torta Cuadrada de Frutas", precio: 50000, stock: 20, stockCritico: 5, imagen: "/imagenes/torta_cuadrada_frutas.png", descripcion: "Una mezcla de frutas frescas y crema chantilly sobre un suave bizcocho de vainilla, ideal para celebraciones." },
  { codigo: "TT001", categoria: "Tortas Circulares", nombre: "Torta Circular de Vainilla", precio: 40000, stock: 20, stockCritico: 5, imagen: "/imagenes/torta_circular_vainilla.png", descripcion: "Bizcocho de vainilla clásico relleno con crema pastelera y cubierto con un glaseado dulce, perfecto para cualquier ocasión." },
  { codigo: "TT002", categoria: "Tortas Circulares", nombre: "Torta Circular de Manjar", precio: 42000, stock: 20, stockCritico: 5, imagen: "/imagenes/torta_circular_manjar.png", descripcion: "Torta tradicional chilena con manjar y nueces, un deleite para los amantes de los sabores dulces y clásicos." },
  { codigo: "PI001", categoria: "Postres Individuales", nombre: "Mousse de Chocolate", precio: 5000, stock: 30, stockCritico: 8, imagen: "/imagenes/mousse_chocolate.png", descripcion: "Postre individual cremoso y suave, hecho con chocolate de alta calidad, ideal para los amantes del chocolate." },
  { codigo: "PI002", categoria: "Postres Individuales", nombre: "Tiramisú Clásico", precio: 5500, stock: 30, stockCritico: 8, imagen: "/imagenes/tiramisu_clasico.png", descripcion: "Un postre italiano individual con capas de café, mascarpone y cacao, perfecto para finalizar cualquier comida." },
  { codigo: "PSA001", categoria: "Productos Sin Azúcar", nombre: "Torta Sin Azúcar de Naranja", precio: 48000, stock: 15, stockCritico: 4, imagen: "/imagenes/torta_naranja_sinAzucar.png", descripcion: "Torta ligera y deliciosa, endulzada naturalmente, ideal para quienes buscan opciones más saludables." },
  { codigo: "PSA002", categoria: "Productos Sin Azúcar", nombre: "Cheesecake Sin Azúcar", precio: 47000, stock: 15, stockCritico: 4, imagen: "/imagenes/cheesecake-sinAzucar.png", descripcion: "Suave y cremoso, este cheesecake es una opción perfecta para disfrutar sin culpa." },
  { codigo: "PT001", categoria: "Pastelería Tradicional", nombre: "Empanada de Manzana", precio: 3000, stock: 40, stockCritico: 10, imagen: "/imagenes/empanada_manzana.png", descripcion: "Pastelería tradicional rellena de manzanas especiadas, perfecta para un dulce desayuno o merienda." },
  { codigo: "PT002", categoria: "Pastelería Tradicional", nombre: "Tarta de Santiago", precio: 6000, stock: 40, stockCritico: 10, imagen: "/imagenes/tarta_santiago.png", descripcion: "Tradicional tarta española hecha con almendras, azúcar y huevos, una delicia para los amantes de los postres clásicos." },
  { codigo: "PG001", categoria: "Productos Sin Gluten", nombre: "Brownie Sin Gluten", precio: 4000, stock: 25, stockCritico: 6, imagen: "/imagenes/brownie_sinGluten.png", descripcion: "Rico y denso, este brownie es perfecto para quienes necesitan evitar el gluten sin sacrificar el sabor." },
  { codigo: "PG002", categoria: "Productos Sin Gluten", nombre: "Pan Sin Gluten", precio: 3500, stock: 25, stockCritico: 6, imagen: "/imagenes/pan_sinGluten.png", descripcion: "Suave y esponjoso, ideal para sándwiches o para acompañar cualquier comida." },
  { codigo: "PV001", categoria: "Productos Vegana", nombre: "Torta Vegana de Chocolate", precio: 50000, stock: 15, stockCritico: 4, descuentoOferta: 20, imagen: "/imagenes/torta_vegana_chocolate.png", descripcion: "Torta de chocolate húmeda y deliciosa, hecha sin productos de origen animal, perfecta para veganos." },
  { codigo: "PV002", categoria: "Productos Vegana", nombre: "Galletas Veganas de Avena", precio: 4500, stock: 25, stockCritico: 6, imagen: "/imagenes/galleta_vegana_avena.png", descripcion: "Crujientes y sabrosas, estas galletas son una excelente opción para un snack saludable y vegano." },
  { codigo: "TE001", categoria: "Tortas Especiales", nombre: "Torta Especial de Cumpleaños", precio: 55000, stock: 10, stockCritico: 3, imagen: "/imagenes/torta_cumpleaños.png", descripcion: "Diseñada especialmente para celebraciones, personalizable con decoraciones y mensajes únicos." },
  { codigo: "TE002", categoria: "Tortas Especiales", nombre: "Torta Especial de Boda", precio: 60000, stock: 10, stockCritico: 3, imagen: "/imagenes/torta_especial_boda.png", descripcion: "Elegante y deliciosa, esta torta está diseñada para ser el centro de atención en cualquier boda." }
]

const completarOfertas = (lista) => lista.map((producto) => {
  if (producto.descuentoOferta !== undefined) return producto
  const inicial = productosIniciales.find((p) => p.codigo === producto.codigo)
  return { ...producto, descuentoOferta: inicial?.descuentoOferta ?? 0 }
})

const leerProductos = () => {
  try {
    const guardados = JSON.parse(localStorage.getItem(CLAVE_PRODUCTOS))
    if (Array.isArray(guardados) && guardados.length > 0) return completarOfertas(guardados)
  } catch {
    return productosIniciales.map((p) => ({ ...p }))
  }
  return productosIniciales.map((p) => ({ ...p }))
}

const guardarProductos = (productos) => {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos))
}

export const obtenerProductos = () => leerProductos()

export const obtenerProductoPorCodigo = (codigo) => leerProductos().find((p) => p.codigo === codigo) || null

const CLAVE_CATEGORIAS = "mil_sabores_categorias"

const categoriasIniciales = [...new Set(productosIniciales.map((p) => p.categoria))]

const leerCategorias = () => {
  try {
    const guardadas = JSON.parse(localStorage.getItem(CLAVE_CATEGORIAS))
    if (Array.isArray(guardadas) && guardadas.length > 0) return guardadas
  } catch {
    return [...categoriasIniciales]
  }
  return [...categoriasIniciales]
}

const guardarCategorias = (categorias) => {
  localStorage.setItem(CLAVE_CATEGORIAS, JSON.stringify(categorias))
}

export const obtenerCategorias = () => leerCategorias()

export const crearCategoria = (nombre) => {
  const limpio = String(nombre || "").trim()
  const categorias = leerCategorias()
  if (!limpio) return { ok: false, error: "El nombre es obligatorio." }
  if (categorias.some((c) => c.toLowerCase() === limpio.toLowerCase())) return { ok: false, error: "Ya existe una categoría con ese nombre." }
  categorias.push(limpio)
  guardarCategorias(categorias)
  return { ok: true, categoria: limpio }
}

export const actualizarCategoria = (anterior, nuevo) => {
  const limpio = String(nuevo || "").trim()
  const categorias = leerCategorias()
  const indice = categorias.indexOf(anterior)
  if (indice === -1) return { ok: false, error: "Categoría no encontrada." }
  if (!limpio) return { ok: false, error: "El nombre es obligatorio." }
  if (categorias.some((c, i) => i !== indice && c.toLowerCase() === limpio.toLowerCase())) return { ok: false, error: "Ya existe una categoría con ese nombre." }
  categorias[indice] = limpio
  guardarCategorias(categorias)
  guardarProductos(leerProductos().map((p) => (p.categoria === anterior ? { ...p, categoria: limpio } : p)))
  return { ok: true, categoria: limpio }
}

export const eliminarCategoria = (nombre) => {
  const categorias = leerCategorias()
  if (!categorias.includes(nombre)) return { ok: false, error: "Categoría no encontrada." }
  if (leerProductos().some((p) => p.categoria === nombre)) return { ok: false, error: "No se puede eliminar una categoría que tiene productos." }
  guardarCategorias(categorias.filter((c) => c !== nombre))
  return { ok: true }
}

export const crearProducto = (producto) => {
  const productos = leerProductos()
  if (productos.some((p) => p.codigo === producto.codigo)) {
    return { ok: false, error: "Ya existe un producto con ese código." }
  }
  productos.push(producto)
  guardarProductos(productos)
  return { ok: true, producto }
}

export const actualizarProducto = (codigo, cambios) => {
  const productos = leerProductos()
  const indice = productos.findIndex((p) => p.codigo === codigo)
  if (indice === -1) return { ok: false, error: "Producto no encontrado." }
  productos[indice] = { ...productos[indice], ...cambios, codigo }
  guardarProductos(productos)
  return { ok: true, producto: productos[indice] }
}

export const eliminarProducto = (codigo) => {
  const productos = leerProductos()
  const restantes = productos.filter((p) => p.codigo !== codigo)
  if (restantes.length === productos.length) return { ok: false, error: "Producto no encontrado." }
  guardarProductos(restantes)
  return { ok: true }
}

export const reiniciarProductos = () => {
  localStorage.removeItem(CLAVE_PRODUCTOS)
}

const CLAVE_USUARIOS = "mil_sabores_usuarios"
const CLAVE_ORDENES = "mil_sabores_ordenes"

const administradorInicial = {
  nombre: "Admin", apellidos: "Sistema", run: "111111111", correo: "admin@duoc.cl", password: "admin123",
  fechaNacimiento: "", telefono: "", region: "Región Metropolitana de Santiago", comuna: "Santiago",
  direccion: "Casa Matriz", tipo: "Administrador", codigoFelices50: false
}

const leerUsuarios = () => {
  let usuarios = []
  try {
    const guardados = JSON.parse(localStorage.getItem(CLAVE_USUARIOS))
    if (Array.isArray(guardados)) usuarios = guardados
  } catch {
    usuarios = []
  }
  if (!usuarios.some((u) => u.tipo === "Administrador")) usuarios = [{ ...administradorInicial }, ...usuarios]
  return usuarios
}

const guardarUsuarios = (usuarios) => {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
}

export const obtenerUsuarios = () => leerUsuarios()

export const obtenerUsuarioPorCorreo = (correo) => {
  const buscado = String(correo || "").trim().toLowerCase()
  return leerUsuarios().find((u) => u.correo.toLowerCase() === buscado) || null
}

export const crearUsuario = (usuario) => {
  const usuarios = leerUsuarios()
  const correo = usuario.correo.trim().toLowerCase()
  const run = String(usuario.run).replace(/\./g, "").replace(/-/g, "").trim().toUpperCase()
  if (usuarios.some((u) => u.correo.toLowerCase() === correo)) return { ok: false, error: "Ya existe una cuenta registrada con ese correo." }
  if (usuarios.some((u) => u.run === run)) return { ok: false, error: "Ya existe una cuenta registrada con ese RUN." }
  const nuevo = { tipo: "Cliente", codigoFelices50: false, ...usuario, correo, run }
  usuarios.push(nuevo)
  guardarUsuarios(usuarios)
  return { ok: true, usuario: nuevo }
}

export const actualizarUsuario = (correo, cambios) => {
  const usuarios = leerUsuarios()
  const indice = usuarios.findIndex((u) => u.correo.toLowerCase() === String(correo).toLowerCase())
  if (indice === -1) return { ok: false, error: "Usuario no encontrado." }
  usuarios[indice] = { ...usuarios[indice], ...cambios, correo: usuarios[indice].correo }
  guardarUsuarios(usuarios)
  return { ok: true, usuario: usuarios[indice] }
}

export const eliminarUsuario = (correo) => {
  const usuarios = leerUsuarios()
  const restantes = usuarios.filter((u) => u.correo.toLowerCase() !== String(correo).toLowerCase())
  if (restantes.length === usuarios.length) return { ok: false, error: "Usuario no encontrado." }
  guardarUsuarios(restantes)
  return { ok: true }
}

const leerOrdenes = () => {
  try {
    const guardadas = JSON.parse(localStorage.getItem(CLAVE_ORDENES))
    return Array.isArray(guardadas) ? guardadas : []
  } catch {
    return []
  }
}

const generarNumeroOrden = (ordenes, hoy = new Date()) => {
  const base = hoy.getFullYear() + String(hoy.getMonth() + 1).padStart(2, "0") + String(hoy.getDate()).padStart(2, "0")
  const delDia = ordenes.filter((o) => o.numero.startsWith(base)).length + 1
  return base + String(delDia).padStart(2, "0")
}

export const obtenerOrdenes = () => leerOrdenes()

export const obtenerOrdenPorNumero = (numero) => leerOrdenes().find((o) => o.numero === numero) || null

export const crearOrden = (orden) => {
  const ordenes = leerOrdenes()
  const numero = generarNumeroOrden(ordenes)
  const nueva = { ...orden, numero, codigo: "ORDER" + numero, fecha: new Date().toISOString() }
  ordenes.push(nueva)
  localStorage.setItem(CLAVE_ORDENES, JSON.stringify(ordenes))
  return nueva
}

export const descontarStock = (items) => {
  const productos = leerProductos()
  items.forEach((item) => {
    const indice = productos.findIndex((p) => p.codigo === item.codigo)
    if (indice !== -1) productos[indice] = { ...productos[indice], stock: Math.max(0, productos[indice].stock - item.cantidad) }
  })
  guardarProductos(productos)
}
