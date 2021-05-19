const { test } = require('../../knexfile')
const knex = require('knex')(test)

const {search} = require('../search')

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (username) => ({
    query: {
        username
    },
    accessToken: '1341234123rfefd',
});

const mockRequestNoAT = (username) => ({
    query: {
        username
    },
});

afterAll(() => {
    jest.resetModules()
    jest.restoreAllMocks()
})

//TESTS
describe("Test search controller - error", () => {
    it('sends a 400 if there is an error', async done => {
        const req = mockRequest('biscuit')
        const res = mockResponse()

        await search(req, res, knex)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message: "An Error has occurred."})
        done()
    })
})

describe("Test search controller - success", () => {
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
    
    it('sends a 200 with the posts from the db + accessToken back to user', async done => {
        const req = mockRequest('biscuit')
        const res = mockResponse()

        await search(req, res, knex)

        const dbResults = await knex
            .select('username', 'posts_id', 'img_url', 'content')
            .from('users')
            .fullOuterJoin('posts', 'users.id', 'posts.user_id')
            .where('username', 'LIKE', `biscuit%`)
            .whereNotNull('posts_id')
            .orderBy('created_at', 'desc')
        
        const expectedData = {
            result: dbResults,
            accessToken: '1341234123rfefd',
            authenticated: true,
        }
    
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith(expectedData)
        done()
    })

    it('sends a 200 with a message + accessToken back to user when no result is found', async done => {
        const req = mockRequest('cheesecake')
        const res = mockResponse()

        await search(req, res, knex)
        
        const expectedData = {
            message: "No results found.",
            accessToken: '1341234123rfefd',
            authenticated: true,
        }
    
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith(expectedData)
        done()
    })

    it('sends a 200 with the posts from the db back to user(no accessToken)', async done => {


        const req = mockRequestNoAT('biscuit')
        const res = mockResponse()

        await search(req, res, knex)

        const dbResults = await knex
            .select('username', 'posts_id', 'img_url', 'content')
            .from('users')
            .fullOuterJoin('posts', 'users.id', 'posts.user_id')
            .where('username', 'LIKE', `biscuit%`)
            .whereNotNull('posts_id')
            .orderBy('created_at', 'desc')
        
        const expectedData = {
            result: dbResults,
        }
    
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith(expectedData)
        done()
    })

    it('sends a 200 with a message back to user even when no result is found + no AT issued', async done => {
        const req = mockRequestNoAT('cheesecake')
        const res = mockResponse()

        await search(req, res, knex)
        
        const expectedData = {
            message: "No results found.",
        }
    
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith(expectedData)
        done()
    })
})