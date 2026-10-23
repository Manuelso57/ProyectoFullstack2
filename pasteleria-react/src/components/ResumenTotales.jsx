import { formatearPrecio } from "../utils/formato"

function ResumenTotales({ resumen }) {
  return (
    <div className="carrito-resumen">
      <div className="carrito-resumen__linea"><span>Subtotal</span><span>{formatearPrecio(resumen.subtotal)}</span></div>
      {resumen.descuento.monto > 0 && (
        <div className="carrito-resumen__linea">
          <span>Descuento ({resumen.descuento.motivo}, {resumen.descuento.porcentaje}%)</span>
          <span>-{formatearPrecio(resumen.descuento.monto)}</span>
        </div>
      )}
      {resumen.tortaGratis.monto > 0 && (
        <div className="carrito-resumen__linea">
          <span>Torta de cumpleaños gratis (Duoc)</span>
          <span>-{formatearPrecio(resumen.tortaGratis.monto)}</span>
        </div>
      )}
      <div className="carrito-resumen__linea carrito-resumen__total"><span>Total</span><span>{formatearPrecio(resumen.total)}</span></div>
    </div>
  )
}

export default ResumenTotales
