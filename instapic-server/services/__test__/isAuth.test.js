const { test } = require('../../knexfile')
const knex = require('knex')(test)

const jwt = require('jsonwebtoken')
const {isAuth} = require('../isAuth')

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

const mockRequest = (authHeader, RT) => ({
    headers: { 'authorization': authHeader },
    cookies: { zed: RT},
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

//TESTS
describe("Test isAuth Middleware", () => {

    it('sends a 401 with a message to user if no access token present', async done => {
        const req = mockRequest('', 'xyz')
        const res = mockResponse()

        await isAuth(req, res, ()=>{})

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "You are not authenticated." })
        done()
    })

    it('sends a 401 with a message to user if the authorization header is only one string', async done => {
        const req = mockRequest('Bearer123', 'xyz')
        const res = mockResponse()

        await isAuth(req, res, ()=>{})

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ message: "You are not authenticated." })
        done()
    })

    it('sends a 401 to user if both tokens have expired', async done => {
        const req = mockRequest('Bearer abc', 'xyz')
        const res = mockResponse()
        const mockedAT = ()=>{return null}
        const mockedRT = ()=>{return null}

        jwt.verify.mockReturnValueOnce(mockedAT()).mockReturnValueOnce(mockedRT)

        await isAuth(req, res, ()=>{})

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ authenticated: false, message: "You are not authenticated." })
        done()
    })

    it('sends a 401 to user if the AT is not valid, but the RT is valid & the token version is not the same as the one recorded in database', async done => {
        const req = mockRequest('Bearer abc', 'xyz')
        const res = mockResponse()
        const mockedAT = ()=>{return null}
        const mockedRT = {
            userId: 1,
            tokenVersion:5
        }

        jwt.verify.mockReturnValueOnce(mockedAT()).mockReturnValueOnce(mockedRT)

        await isAuth(req, res, ()=>{})

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({ authenticated: false, message: "You are not authenticated." })
        done()
    })
    
    it('the req object will contain a "userId" key-value pair if the AT is valid', async done => {
        const req = mockRequest('Bearer abc', 'xyz')
        const res = mockResponse()
        const mockedAT = {
            userId: 1,
        }

        jwt.verify.mockReturnValueOnce(mockedAT)

        await isAuth(req, res, ()=>{})

        expect(req).toHaveProperty("userId")
        done()
    })

    it('the req object will contain a "userId" & "accessToken" if the AT is invalid but the RT is valid', async done => {
        const req = mockRequest('Bearer abc', 'xyz')
        const res = mockResponse()
        const mockedAT = ()=>{return null}
        const mockedRT = {
            userId: 1,
            tokenVersion:1
        }

        jwt.verify.mockReturnValueOnce(mockedAT()).mockReturnValueOnce(mockedRT)

        await isAuth(req, res, ()=>{})

        expect(req).toHaveProperty("userId")
        expect(req).toHaveProperty("accessToken")
        done()
    })

})

