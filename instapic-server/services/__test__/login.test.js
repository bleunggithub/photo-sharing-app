const { test } = require('../../knexfile')
const knex = require('knex')(test)

const { login } = require('../login')

const { createRefreshToken, createAccessToken } = require('../../jwt/tokenUtil')
const { checkPassword } = require('../../jwt/bcrypt')

jest.mock('../../jwt/tokenUtil')
jest.mock('../../jwt/bcrypt')

const mockRequest = (username,password) => ({
    body: {
        username,
        password
    },
});

const mockResponse = () => {
    const res = {};
    res.cookie = {}
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.headers = {}
    res.cookie = jest.fn((name, value, options) => {
        res.headers[name] = value + `;${Object.keys(options)[0]}`
    })
    return res;
};

afterAll(() => {
    jest.resetModules()
    jest.restoreAllMocks()
})

//TESTS
describe("Test login controller - error", () => {
    it('sends a 400 if there is an error', async done => {
        const req = mockRequest('biscuit','qwerty')
        const res = mockResponse()

        await login(req, res, knex)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ message: [{message: "An Error has occurred."}] })
        done()
    })
})

describe("Test login controller", () => {
    beforeAll(async done => {
        await knex.migrate.latest()
        await knex.seed.run()
        console.log("tables created")
        done()
    })
    
    afterAll(async done => {
        await knex.migrate.rollback(true)
        await knex.destroy()
        console.log('tables dropped')
        done()
    });
    
    it('sends a 400 with error message to user when no username/password is entered', async done => {
        const req = mockRequest('','')
        const res = mockResponse()

        await login(req, res, knex)
    
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({message:[{ message: "Please enter all fields." }]})
        done()
    })
    
    it('sends a 400 and message when username entered is not found in the DB', async done => {
        const req = mockRequest('grapes','123456')
        const res = mockResponse()

        await login(req, res, knex)
    
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({message:[{ message: "The username you entered is not registered." }]})
        done()
    })  
    
    it('sends a 400 and message when password entered is not correct', async done => {
        const req = mockRequest('cookie','123456')
        const res = mockResponse()

        checkPassword.mockReturnValue(false)
        await login(req, res, knex)
    
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({message:[{ message: "Your password is incorrect." }]})
        done()
    })  
    
    it('sends a 200 & AT & renewed RT to user when successfully logged in', async done => {
        const req = mockRequest('cookie','1234')
        const res = mockResponse()

        createRefreshToken.mockReturnValueOnce('mockedRT')
        createAccessToken.mockReturnValueOnce('mockedAT')
        checkPassword.mockReturnValue(true)
        await login(req, res, knex)
    
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.cookie).toHaveBeenCalledTimes(1)
        expect(res.headers.zed).toBeDefined()
        expect(res.headers.zed).toEqual("mockedRT;httpOnly")
        expect(res.json).toHaveBeenCalledWith({ authenticated: true, accessToken: 'mockedAT'})
        done()
    })  
})
