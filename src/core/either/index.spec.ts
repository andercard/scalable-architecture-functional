import { describe, it, expect } from 'vitest'
import { right, left } from './index'

describe('Either', () => {
  it('right() debe crear un Right', () => {
    const e = right(42)
    expect(e.isRight()).toBe(true)
    expect(e.isLeft()).toBe(false)
  })

  it('left() debe crear un Left', () => {
    const e = left('error')
    expect(e.isLeft()).toBe(true)
    expect(e.isRight()).toBe(false)
  })

  it('map() en Right debe transformar el valor', () => {
    const e = right(2).map(x => x * 3)
    expect(e.fold(
      () => 0,
      v => v
    )).toBe(6)
  })

  it('map() en Left no debe transformar el valor', () => {
    const e = left('fail').map((x: number) => x * 3)
    expect(e.fold(
      err => err,
      () => 'ok'
    )).toBe('fail')
  })

  it('map() puede transformar el tipo del valor', () => {
    const e = right(10).map(x => x.toString())
    expect(e.isRight()).toBe(true)
    expect(e.fold(() => '', v => v)).toBe('10')
  })

  it('map() anidado en Right funciona correctamente', () => {
    const e = right(5)
      .map(x => x + 1)
      .map(x => x * 2)
    expect(e.isRight()).toBe(true)
    expect(e.fold(() => 0, v => v)).toBe(12)
  })

  it('map() no ejecuta la función en Left', () => {
    let called = false
    const e = left('fail').map(() => { called = true; return 123 })
    expect(called).toBe(false)
    expect(e.isLeft()).toBe(true)
  })

  it('flatMap() en Right debe encadenar operaciones', () => {
    const e = right(5).flatMap(x => right(x + 1))
    expect(e.fold(
      () => 0,
      v => v
    )).toBe(6)
  })

  it('flatMap() en Left debe mantener el error', () => {
    const e = left('fail').flatMap((x: number) => right(x + 1))
    expect(e.fold(
      err => err,
      () => 'ok'
    )).toBe('fail')
  })

  it('flatMap() puede transformar el tipo del valor', () => {
    const e = right(10).flatMap(x => right(x.toString()))
    expect(e.isRight()).toBe(true)
    expect(e.fold(() => '', v => v)).toBe('10')
  })

  it('flatMap() anidado en Right funciona correctamente', () => {
    // @ts-ignore - Error de tipos complejos en Either
    const first = right(5).flatMap((x: number) => right(x + 1))
    // @ts-ignore - Error de tipos complejos en Either
    const second = first.flatMap((x: number) => right(x * 2))
    expect(second.isRight()).toBe(true)
    expect(second.fold(() => 0, (v: number) => v)).toBe(12)
  })

  it('flatMap() no ejecuta la función en Left', () => {
    let called = false
    // @ts-ignore - Error de tipos complejos en Either
    const e = left('fail').flatMap((_: number) => { called = true; return right(123) })
    expect(called).toBe(false)
    expect(e.isLeft()).toBe(true)
  })

  it('flatMap() puede retornar Left en la cadena', () => {
    // @ts-ignore - Error de tipos complejos en Either
    const first = right(5).flatMap((x: number) => right(x + 1))
    // @ts-ignore - Error de tipos complejos en Either
    const second = first.flatMap((_: number) => left('error en la cadena'))
    expect(second.isLeft()).toBe(true)
    expect(second.fold((err: string) => err, () => 'ok')).toBe('error en la cadena')
  })

  it('combinación de map() y flatMap() funciona correctamente', () => {
    const mapped = right(5).map((x: number) => x + 1)
    // @ts-ignore - Error de tipos complejos en Either
    const flatMapped = mapped.flatMap((x: number) => right(x * 2))
    const final = flatMapped.map((x: number) => x.toString())
    expect(final.isRight()).toBe(true)
    expect(final.fold(() => '', (v: string) => v)).toBe('12')
  })

  it('fold() debe ejecutar la función correcta', () => {
    const r = right('ok').fold(
      () => 'fail',
      v => v
    )
    const l = left('fail').fold(
      v => v,
      () => 'ok'
    )
    expect(r).toBe('ok')
    expect(l).toBe('fail')
  })
}) 