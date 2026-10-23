export const procesarPago = ({ total, resultado }) =>
  new Promise((resolver) => {
    setTimeout(() => resolver({ aprobado: resultado !== "rechazado", total }), 600)
  })
