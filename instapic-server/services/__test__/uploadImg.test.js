const { test } = require('../../knexfile')
const knex = require('knex')(test)

const cloudinary = require('cloudinary').v2
const { uploadImg } = require('../uploadImg')

jest.mock('cloudinary')

const mockRequest = () => ({
    files: {
        file: {
            mimetype: 'image/jpeg',
            data: 'aihgsldfgklsjdhfkgjasdflag234567'
        }
    },
    body: {
        message: 'Test Message'
    },
    userId: 1
});

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

afterAll(() => {
    jest.resetModules()
    jest.restoreAllMocks()
})

//TEST
describe("Test uploadImg controller", () => {
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
        done()
    });

    it('sends a 400 if upload error', async done => {
        const req = mockRequest()
        const res = mockResponse()
        
        const mockedError = new Error()
        cloudinary.uploader.upload.mockReturnValueOnce(mockedError)

        await uploadImg(req, res, knex)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({message: "An Error has occurred while uploading."})
        
        done()
    })
    
    
    it('should write into the database if no error', async done => {
        const req = mockRequest()
        const res = mockResponse()
        
        const mockedUploaded = {
            public_id: 35438686
        }
        cloudinary.uploader.upload.mockReturnValueOnce(mockedUploaded)
        await uploadImg(req, res, knex)

        const testResults = await knex('posts').select('*')
        
        expect(testResults.length).toBe(4) //seed file has 3 entries
        done()
    })
})

describe("Test uploadImg controller(database error)", () => {

    it('sends a 400 if database error', async done => {
        const req = mockRequest()
        const res = mockResponse()
    
        const mockedUploaded = {
            public_id: 2345678
        }
        cloudinary.uploader.upload.mockReturnValueOnce(mockedUploaded)

        await uploadImg(req, res, knex)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({ message: "An Error has occurred while saving." })

        done()
    })
})