import { Routes, Route } from "react-router-dom"
import Menu from "./components/Menu"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import Productos from "./pages/Productos"
import DetalleProducto from "./pages/DetalleProducto"
import Categorias from "./pages/Categorias"
import Nosotros from "./pages/Nosotros"
import Blogs from "./pages/Blogs"
import BlogDetalle from "./pages/BlogDetalle"
import Contacto from "./pages/Contacto"
import Ofertas from "./pages/Ofertas"
import Carrito from "./pages/Carrito"
import Checkout from "./pages/Checkout"
import CompraExitosa from "./pages/CompraExitosa"
import PagoError from "./pages/PagoError"
import Login from "./pages/Login"
import Registro from "./pages/Registro"
import EnConstruccion from "./pages/EnConstruccion"

function Tienda() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Menu />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:codigo" element={<DetalleProducto />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/categorias/:nombre" element={<Categorias />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<BlogDetalle />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/compra-exitosa/:numero" element={<CompraExitosa />} />
          <Route path="/pago-error/:numero" element={<PagoError />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="*" element={<EnConstruccion />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default Tienda
