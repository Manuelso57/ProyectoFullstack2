import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { SesionProvider } from './context/SesionContext'
import Admin from './admin/Admin'
import { crearUsuario, crearOrden } from './data/datos'

export const iniciarSesionComo = (correo) => localStorage.setItem("mil_sabores_sesion", correo)

export const crearCliente = (correo = "cli@gmail.com", run = "123456785") => {
  crearUsuario({ nombre: "Cris", apellidos: "Cliente", run, correo, password: "abcd", region: "RM", comuna: "Santiago", direccion: "Calle 3" })
  return correo
}

export const crearOrdenDePrueba = (cambios = {}) => crearOrden({
  estado: "Pagada",
  correoUsuario: null,
  cliente: { nombre: "Pedro", apellidos: "Soto", correo: "pedro@gmail.com" },
  entrega: { calle: "Calle 1", departamento: "", region: "RM", comuna: "Santiago", indicaciones: "" },
  items: [{ codigo: "TC001", nombre: "Torta Cuadrada de Chocolate", precio: 36000, imagen: "/imagenes/torta_chocolate.png", cantidad: 2 }],
  subtotal: 72000,
  total: 72000,
  ...cambios
})

export const renderAdmin = (ruta) => render(
  <MemoryRouter initialEntries={[ruta]}>
    <SesionProvider>
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route path="/login" element={<p>Pantalla de login</p>} />
        <Route path="/" element={<p>Pantalla de inicio</p>} />
      </Routes>
    </SesionProvider>
  </MemoryRouter>
)
