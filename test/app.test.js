const request = require('supertest')
const app = require('../src/app')
const mockdb = require('../src/mockdb.js')

describe('Teste de integração', () => {
  beforeEach(async () => {
    await mockdb.limparDados()
  //  await mockdb.consulta.destroy({ where: {} })
  })
  // afterAll(async () => await db.sequelize.close())

  const clienteVinicio = {
    Nome: 'Vinicio Miranda Covalski',
    CPF: '000.000.000-00'
  }

  const resultadoEsperado = {
    montante: 106.9,
    juros: 0.025,
    parcelas: 3,
    primeiraPestacao: 35.64,
    prestacoes: [35.64, 35.63, 35.63]
  }

  const payloadRequest = {
    nome: clienteVinicio.Nome,
    CPF: clienteVinicio.CPF,
    valor: 101.75,
    parcelas: 3

  }

  test('responde http 200 na raiz', () => {
    return request(app).get('/')
      .then(res => expect(res.status).toBe(200))
  })
  test('Cenário 01', async () => {
    const res = await request(app).post('/consulta-credito').send(payloadRequest)
    // Resultado [e obtido com sucessp]

    expect(res.body.erro).toBeUndefined()
    expect(res.body.montante).toBe(106.9)
    expect(res.status).toBe(201)
//expect(res.body).toMatchSnapshot(resultadoEsperado)
    // expect(res.body).toMachObject(resultadoEsperado)

    // Cliente foi armazenado
    const cliente = await mockdb.encontrarCliente(clienteVinicio.CPF)
    expect(cliente.CPF).toBe(clienteVinicio.CPF)

    // expect(consulta.Valor).toBe(101.75)
  })

  test('Cenário 02', async () => {
    /*   db.cliente.create(clienteVinicio)
    db.consulta.create({
      Valor: 1,
      NumPrestacoes: 2,
      Juros: 0.5,
      Prestacoes: '1, 1',
      ClienteCPF: clienteVinicio.CPF,
      Montante: 2,
      createdAt: '2016-06-22 19:10:25-07'
    })
*/

    mockdb.criarCliente({
      Nome: clienteVinicio.Nome,
      CPF: clienteVinicio.CPF,
      ulitmaConsulta: '2016-06-22 19:10:25-07'
    })

    const res = await request(app)
      .post('/consulta-credito')
      .send(payloadRequest)
      // Resultado é otibdo com sucesso
    expect(res.body.erro).toBeUndefined()
    expect(res.body.montante).toBe(106.9)
    expect(res.status).toBe(201)
    //  expect(res.body).toMatchSnapshot(resultadoEsperado)
    //  expect(res.body).toMachObject(resultadoEsperado)
    // Cliente foi armazenado com sucesso
    const cliente = mockdb.encontrarCliente(clienteVinicio.CPF)
    expect(cliente.CPF).toBe(clienteVinicio.CPF)
    expect(cliente.ulitmaConsulta).toBeDefined()
  })

  test('Cenário 03', async () => {
    // debugger
    const res1 = await request(app)
      .post('/consulta-credito').send(payloadRequest)
    expect(res1.body).toMatchSnapshot()

    const res2 = await request(app)
      .post('/consulta-credito').send(payloadRequest)

    // Resultado obtido
    expect(res2.body.erro).toBeDefined()
    expect(res2.status).toBe(405)
  })

  test('Cénario 04', async () => {
    const res = await request(app).post('/consulta-credito').send({})

    expect(res.body.erro).toBeDefined()
    expect(res.status).toBe(400)
  })

  /* test.skip('Cliente Persistidos na base ', async () => {
    debugger
    const res = await request(app).get('/cliente').send({})
    const count = await db.consulta.count({ where: { ClienteCPF: clienteVinicio.CPF } })
    const countCliente = await db.cliente.count()
    expect(res.status).toBe(200)
    expect(count).toBe(3)
    expect(countCliente).toBe(1)
  }) */
})
