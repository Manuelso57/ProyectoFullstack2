import { Routes, Route } from "react-router-dom"
import Tienda from "./Tienda"
import Admin from "./admin/Admin"

function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Admin />} />
      <Route path="*" element={<Tienda />} />
    </Routes>
  )
}

export default App
