const { logout } = require('../logout')

const mockResponse = () => {
    const res = {}
    res.headers = {
        'zed' : 'originalCookie'
    }
    res.clearCookie = jest.fn(() => {
        res.headers['zed'] = ""
    })
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res
}

afterAll(() => {
    jest.resetModules()
    jest.restoreAllMocks()
})

describe("Test if 'logout' clears cookie", () => {
    it('clears cookie when log out', () => {
        const res = mockResponse()

        logout({},res)

        expect(res.clearCookie).toHaveBeenCalledTimes(1)
        expect(res.headers.zed).toEqual('')
        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({message: 'logged out successfully.'})

    })
})