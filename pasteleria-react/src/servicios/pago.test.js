import { describe, it, expect, vi, afterEach } from 'vitest'
import { procesarPago } from './pago'

afterEach(() => vi.useRealTimers())

describe('servicio de pago (simulado)', () => {
  it('aprueba el pago después de un breve tiempo de espera', async () => {
    vi.useFakeTimers()
    const promesa = procesarPago({ total: 5000, resultado: "aprobado" })
    await vi.advanceTimersByTimeAsync(600)
    await expect(promesa).resolves.toEqual({ aprobado: true, total: 5000 })
  })

  it('rechaza el pago cuando la simulación lo indica', async () => {
    vi.useFakeTimers()
    const promesa = procesarPago({ total: 5000, resultado: "rechazado" })
    await vi.advanceTimersByTimeAsync(600)
    await expect(promesa).resolves.toEqual({ aprobado: false, total: 5000 })
  })

  it('no responde antes de que pase el tiempo de espera', async () => {
    vi.useFakeTimers()
    let respondio = false
    procesarPago({ total: 1, resultado: "aprobado" }).then(() => { respondio = true })
    await vi.advanceTimersByTimeAsync(300)
    expect(respondio).toBe(false)
  })
})
