const { test } = require('../../knexfile')
const knex = require('knex')(test)

const {getPostsFromDB} = require('../getPostsFromDB')

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

const mockRequest = (page, sort) => ({
    query: {
        page,
        sort,
    },
    accessToken: '1341234123rfefd',
});

const mockRequestNoAT = (page, sort) => ({
    query: {
        page,
        sort,
    },
});

afterAll(() => {
    jest.resetModules()
    jest.restoreAllMocks()
})
//TESTS
describe("Test getPostsFromDB controller - error", () => {

    //DB error, no connection
    it('sends a 400 if there is an error', async done => {
        const req = mockRequest('1', 'asc')
        const res = mockResponse()

        await getPostsFromDB(req, res, knex)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message: "An Error has occurred."})
        done()
    })
})

describe("Test getPostsFromDB controller - success", () => {
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
        const req = mockRequest('1', 'asc')
        const res = mockResponse()

        await getPostsFromDB(req, res, knex)

        const dbResults = await knex
            .select('username', 'posts_id', 'img_url', 'content')
            .from('users')
            .fullOuterJoin('posts', 'users.id', 'posts.user_id')
            .whereNotNull('posts_id')
            .orderBy('created_at', 'asc')
            .offset(0)
            .limit(6)
        
        const expectedData = {
            posts: dbResults,
            message: 'This is the last page.',
            accessToken: '1341234123rfefd',
            authenticated: true,
        }
    
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith(expectedData)
        done()
    })

    it('sends a 200 with the posts from the db back to user(no accessToken)', async done => {
        const req = mockRequestNoAT('1', 'desc')
        const res = mockResponse()

        await getPostsFromDB(req, res, knex)

        const dbResults = await knex
            .select('username', 'posts_id', 'img_url', 'content')
            .from('users')
            .fullOuterJoin('posts', 'users.id', 'posts.user_id')
            .whereNotNull('posts_id')
            .orderBy('created_at', 'desc')
            .offset(0)
            .limit(6)
        
        const expectedData = {
            posts: dbResults,
            message: 'This is the last page.',
        }
    
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith(expectedData)
        done()
    })
})