import { Routes, Route } from "react-router-dom"
import RutaProtegida from "./RutaProtegida"
import AdminLayout from "./AdminLayout"
import Dashboard from "./Dashboard"
import Ordenes from "./Ordenes"
import Boleta from "./Boleta"
import Productos from "./Productos"
import ProductosCriticos from "./ProductosCriticos"
import ProductoForm from "./ProductoForm"
import Categorias from "./Categorias"
import CategoriaForm from "./CategoriaForm"
import Usuarios from "./Usuarios"
import UsuarioForm from "./UsuarioForm"
import HistorialCompras from "./HistorialCompras"
import Reportes from "./Reportes"
import Perfil from "./Perfil"

function Admin() {
  return (
    <RutaProtegida roles={["Administrador"]}>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="ordenes" element={<Ordenes />} />
          <Route path="ordenes/:numero" element={<Boleta />} />
          <Route path="productos" element={<Productos />} />
          <Route path="productos/criticos" element={<ProductosCriticos />} />
          <Route path="productos/nuevo" element={<ProductoForm key="nuevo" />} />
          <Route path="productos/:codigo/editar" element={<ProductoForm key="editar" />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="categorias/nueva" element={<CategoriaForm key="nueva" />} />
          <Route path="categorias/:nombre/editar" element={<CategoriaForm key="editar" />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="usuarios/nuevo" element={<UsuarioForm key="nuevo" />} />
          <Route path="usuarios/:correo/editar" element={<UsuarioForm key="editar" />} />
          <Route path="usuarios/:correo/historial" element={<HistorialCompras />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </RutaProtegida>
  )
}

export default Admin
