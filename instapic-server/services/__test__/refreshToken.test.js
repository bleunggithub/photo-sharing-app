const { test } = require('../../knexfile')
const knex = require('knex')(test)

const jwt = require('jsonwebtoken')
const { createAccessToken } = require('../../jwt/tokenUtil')
const { refreshToken } = require('../refreshToken')

jest.mock('../../jwt/tokenUtil')
jest.mock('jsonwebtoken')

//set up
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
    jest.resetModules()
    jest.restoreAllMocks()
    done()
});

const mockRequest = (RT) => ({
    cookies: {
        zed: RT
    },
});

const mockResponse = () => {
    const res = {}
    res.sendStatus = jest.fn().mockReturnValue(res)
    res.status = jest.fn().mockReturnValue(res)
    res.json = jest.fn().mockReturnValue(res)
    res.headers = {}
    res.cookie = jest.fn((name, value, options) => {
        res.headers[name] = value + `;${Object.keys(options)[0]}`
    })
    return res
};

//TESTS
describe("Test refresh token controller", () => {

    it('sends a 204 to user if no access token present', async done => {
        const req = {cookies: ''}
        const res = mockResponse()

        await refreshToken(req, res, knex)

        expect(res.sendStatus).toHaveBeenCalledWith(204)
        done()
    })

    it('sends a 401 to user if both RT has expired', async done => {
        const req = mockRequest('expired')
        const res = mockResponse()
        const mockedRT = ()=>{return null}

        jwt.verify.mockReturnValueOnce(mockedRT)

        await refreshToken(req, res, knex)

        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({authenticated: false, message: "You are not authenticated."})
        done()
    })

    it('sends a 401 to user if the RT version is not the same as recorded in DB', async done => {
        const req = mockRequest('old token')
        const res = mockResponse()
        const mockedRT = ()=>{return {userId:1, tokenVersion:3}}

        jwt.verify.mockReturnValueOnce(mockedRT)

        await refreshToken(req, res, knex)

        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({authenticated: false, message: "You are not authenticated."})
        done()
    })

    it('sends a 200 & AT & renewed RT to user if the RT version is the same as recorded in DB', async done => {
        const req = mockRequest('valid token')
        const res = mockResponse()
        const mockedRT = {
            userId: 1,
            tokenVersion:1
        }

        jwt.verify.mockReturnValueOnce(mockedRT)

        createAccessToken.mockReturnValueOnce('mockedAT')

        await refreshToken(req, res, knex)

        expect(res.status).toHaveBeenCalledTimes(1)
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.cookie).toHaveBeenCalledTimes(1)
        expect(res.headers.zed).toBeDefined()
        expect(res.json).toHaveBeenCalledWith({authenticated: true, accessToken:'mockedAT' })
        done()
    })

})

