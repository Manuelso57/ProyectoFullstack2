import { useState } from "react"
import { validarCampo } from "../utils/validaciones"

export function useFormulario(valoresIniciales, reglas) {
  const [valores, setValores] = useState(valoresIniciales)
  const [errores, setErrores] = useState({})

  const cambiar = (evento) => {
    const { name, value } = evento.target
    const nuevos = { ...valores, [name]: value }
    setValores(nuevos)
    setErrores((previos) => {
      const siguientes = { ...previos, [name]: validarCampo(value, reglas[name], nuevos) }
      Object.keys(reglas).forEach((otro) => {
        if (reglas[otro].coincideCon === name && nuevos[otro]) siguientes[otro] = validarCampo(nuevos[otro], reglas[otro], nuevos)
      })
      return siguientes
    })
  }

  const salirDelCampo = (evento) => {
    const { name, value } = evento.target
    setErrores((previos) => ({ ...previos, [name]: validarCampo(value, reglas[name], valores) }))
  }

  const validarTodo = () => {
    const siguientes = {}
    let todoValido = true
    Object.keys(reglas).forEach((nombre) => {
      const error = validarCampo(valores[nombre] ?? "", reglas[nombre], valores)
      siguientes[nombre] = error
      if (error) todoValido = false
    })
    setErrores(siguientes)
    return todoValido
  }

  const reiniciar = () => {
    setValores(valoresIniciales)
    setErrores({})
  }

  return { valores, errores, cambiar, salirDelCampo, validarTodo, reiniciar }
}
