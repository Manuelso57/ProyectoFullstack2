import { createContext, useContext, useEffect, useState } from "react"
import { obtenerProductoPorCodigo } from "../data/datos"
import { precioFinal } from "../utils/formato"

const CLAVE_CARRITO = "mil_sabores_carrito"
const CarritoContext = createContext(null)

const leerCarrito = () => {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO))
    return Array.isArray(guardado) ? guardado : []
  } catch {
    return []
  }
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarrito)

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items))
  }, [items])

  const agregar = (codigo, cantidad = 1) => {
    setItems((previos) => {
      const existente = previos.find((i) => i.codigo === codigo)
      if (existente) {
        return previos.map((i) => (i.codigo === codigo ? { ...i, cantidad: i.cantidad + cantidad } : i))
      }
      return [...previos, { codigo, cantidad }]
    })
  }

  const quitar = (codigo) => setItems((previos) => previos.filter((i) => i.codigo !== codigo))

  const cambiarCantidad = (codigo, cantidad) => {
    if (cantidad < 1) {
      quitar(codigo)
      return
    }
    setItems((previos) => previos.map((i) => (i.codigo === codigo ? { ...i, cantidad } : i)))
  }

  const vaciar = () => setItems([])

  const totalItems = items.reduce((suma, i) => suma + i.cantidad, 0)

  const subtotal = items.reduce((suma, i) => {
    const producto = obtenerProductoPorCodigo(i.codigo)
    return producto ? suma + precioFinal(producto) * i.cantidad : suma
  }, 0)

  return (
    <CarritoContext.Provider value={{ items, agregar, quitar, cambiarCantidad, vaciar, totalItems, subtotal }}>
      {children}
    </CarritoContext.Provider>
  )
}

export const useCarrito = () => {
  const contexto = useContext(CarritoContext)
  if (!contexto) throw new Error("useCarrito debe usarse dentro de CarritoProvider")
  return contexto
}
