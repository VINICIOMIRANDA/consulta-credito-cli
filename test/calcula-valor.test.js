const calculaValor = require('../src/calcula-valor.js')
require('./extensoes.js')

describe('calcularMontante', () => {
  test('Com uma prestação, o momento é igual ao capital', () => {
    // Operação
    const montante = calculaValor.calcularMontante(100, 0.0175, 1)

    // Resultado ou comportamento esperado

    expect(montante).toBe(100)
  })

  test('Com 4 prestações o montante é acrescido de juros', () => {
    const montante = calculaValor.calcularMontante(500, 0.025, 4)
    // Resultado esperado
    // expect(montante).toBeCloseTo(538.45)
    expect(montante).toBe(538.45)
  })
})

describe('arredondar', () => {
  test('Arrendodar em duas cadas decimais', () => {
    const resultado = calculaValor.arredondar(538.4453124999998)
    expect(resultado).toBe(538.45)
  })

  // 1.005 -> Esperado 1.01, 1.00

  test('1.005 deve retornar 1.01', () => {
    const resultado = calculaValor.arredondar(1.005)
    expect(resultado).toBe(1.01)
  })
})

describe('calcularPrestacoes', () => {
  test('O número de parecelas é igual ao número de prestações', () => {
    const numeroPrestacoes = 6
    const prestacoes = calculaValor.calcularPrestacoes(200, numeroPrestacoes)
    expect(prestacoes.length).toBe(numeroPrestacoes)
  })

  test('Um única prestação , valor igual ao montante', () => {
    const numeroPrestacoes = 1
    const prestacoes = calculaValor.calcularPrestacoes(50, numeroPrestacoes)
    expect(prestacoes.length).toBe(numeroPrestacoes)
    expect(prestacoes[0]).toBe(50)
  })

  test('Duas prestações, valor igual à metade do montante', () => {
    const numeroPrestacoes = 2
    const prestacoes = calculaValor.calcularPrestacoes(50, numeroPrestacoes)
    expect(prestacoes.length).toBe(numeroPrestacoes)
    expect(prestacoes[0]).toBe(25)
    expect(prestacoes[1]).toBe(25)
    // expect(prestacoes[0] + prestacoes[1]).toBe(50)
  })
  test('Valor da soma das prestações deve ser igual ao montantes com duas casas decimais', () => {
    // debugger;
    // Dado  (given)
    const numeroPrestacoes = 3
    const montante = 100

    // Quando (when)

    const prestacoes = calculaValor.calcularPrestacoes(montante, numeroPrestacoes)
    // Então (then)
    expect(prestacoes.length).toBe(numeroPrestacoes)
    const soma = calculaValor.arredondar(prestacoes[0] + prestacoes[1] + prestacoes[2])
    expect(soma).toBe(montante)
    expect(prestacoes).sejaDecrescente()
  })

  test('Desafio semi-final', () => {
    // eslint-disable-next-line no-debugger
    // debugger
    // Given
    const numeroPrestacoes = 3
    const montante = 101.994
    const prestacoes = calculaValor.calcularPrestacoes(montante, numeroPrestacoes)
    // Então (then)
    expect(prestacoes.length).toBe(numeroPrestacoes)
    expect(prestacoes).tenhaSomaDeValoresIgual(montante)
    expect(prestacoes).sejaDecrescente()

    const meuArray = [1, 2, 3, 4]
    expect(meuArray).not.sejaDecrescente()
  })

  test('O montante deve ser um número maior que 0', () => {
    // debugger
    // Given
    const numeroPrestacoes = 100
    const montante = 10

    // Quando
    const prestacoes = calculaValor.calcularPrestacoes(montante, numeroPrestacoes)
    expect.not.arrayContaining(prestacoes)
    // expect(prestacoes).toBe(0)
  })

  test('O numero de parcelas deve ser maior que 0', () => {
    // debugger
    const numeroPrestacoes = -10
    const montante = 300
    const prestacoes = calculaValor.calcularPrestacoes(montante, numeroPrestacoes)

    //   expect(prestacoes.length).not.arrayContaining(expect)
    expect(prestacoes).toBe(0)

    expect.not.arrayContaining(prestacoes)
  })
})
