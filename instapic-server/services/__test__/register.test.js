const { test } = require('../../knexfile')
const knex = require('knex')(test)

const { register } = require('../register')

const { createRefreshToken, createAccessToken } = require('../../jwt/tokenUtil')

jest.mock('../../jwt/tokenUtil')

const mockRequest = (username,password) => ({
    body: {
        username,
        password
    },
});

const mockResponse = () => {
    const res = {};
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
describe("Test register controller - error", () => {
    it('sends a 400 if there is an error', async done => {
        const req = mockRequest('biscuit','qwerty')
        const res = mockResponse()

        await register(req, res, knex)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ message: [{message: "An Error has occurred."}] })
        done()
    })
})

describe("Test register controller - form validation", () => {
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

        await register(req, res, knex)
    
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({message:[{ message: "Please complete all required fields." }]})
        done()
    })

    it('sends a 400 with error message to user when username/password entered is shorter than 4 ch', async done => {
        const req = mockRequest('cat','123')
        const res = mockResponse()

        await register(req, res, knex)
    
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({message:[{ message: "Username & password should be at least 4 characters long." }]})
        done()
    })

    it('sends a 400 with error message to user when username entered is registered', async done => {
        const req = mockRequest('cookie','123456')
        const res = mockResponse()

        await register(req, res, knex)
    
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith({message:[{ message: "Sorry, the username you entered is already taken." }]})
        done()
    })
    
    it('sends a 200 & AT to user when successfully registered', async done => {
        const req = mockRequest('grapes','123456')
        const res = mockResponse()

        createRefreshToken.mockReturnValueOnce('mockedRT')
        createAccessToken.mockReturnValueOnce('mockedAT')
        await register(req, res, knex)
    
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.cookie).toHaveBeenCalledTimes(1)
        expect(res.headers.zed).toBeDefined()
        expect(res.headers.zed).toEqual("mockedRT;httpOnly")
        expect(res.json).toHaveBeenCalledWith({ authenticated: true, accessToken: 'mockedAT'})
        done()
    })  
})
