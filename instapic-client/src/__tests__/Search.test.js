import { render, waitFor, cleanup, screen, act } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom'

import axios from 'axios'
import 'intersection-observer';

import { UserContext } from '../context/UserContext';
import Search from '../Pages/Search';
import {postDataSecond, postDataSearch} from '../testData'
import userEvent from '@testing-library/user-event';

jest.mock('axios')

afterEach(cleanup)

afterAll(() => {
  jest.resetModules()
  jest.restoreAllMocks()
});

describe("Search page/ component", () => {
    beforeEach(() => {

        const user = {
            authenticated: true,
            accessToken: '1234'
            }
        const setUser = jest.fn()

        render(
            <UserContext.Provider value={{user, setUser}}>
                <MemoryRouter initialEntries={["/search"]}>
                    <Search />
                </MemoryRouter>
            </UserContext.Provider>
        )
    })

    it('renders without crashing', async () => {
        await waitFor(() => expect(screen.getByTestId("search-container")).toBeInTheDocument())
        await waitFor(()=> expect(screen.getByPlaceholderText(/Search user/i)).toBeInTheDocument())
        await waitFor(()=> expect(screen.getByTestId("pic-grid-div")).toBeInTheDocument())
    })


    it('sends GET requests when typed, does not render pagination if the results can fit in 1 page', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                result: postDataSecond //length === 6
            }
        }).mockResolvedValueOnce({
            data: {
                message: "No results found."
            }
        })
        
        act(() => {
            userEvent.type(screen.getByPlaceholderText(/Search user/i),'b')
        })
        await waitFor(()=> expect(axios.get).toHaveBeenCalledTimes(1))
        act(() => {
            userEvent.type(screen.getByPlaceholderText(/Search user/i),'c')
        })
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2))
        await waitFor(()=> expect(screen.queryByTestId('pagination-container')).not.toBeInTheDocument())
        
    })
    
    it("displays pictures when data returns from db", async()=>{
        axios.get.mockResolvedValueOnce({
            data: {
                result: postDataSearch, //length === 9
            }
        })
        
        act(() => {
            userEvent.type(screen.getByPlaceholderText(/Search user/i),'X')
        })
        await waitFor(()=> expect(screen.getAllByTestId('grid-img').length).toBe(12))//6 are results, the other 6 are placeholder images for lazy loading
        
    })
    
    it("displays pagination if the results returned are greater than 1 page", async()=>{
        axios.get.mockResolvedValueOnce({
            data: {
                result: postDataSearch, //length === 9
            }
        })
        
        act(() => {
            userEvent.type(screen.getByPlaceholderText(/Search user/i),'X')
        })
        await waitFor(()=> expect(screen.getByTestId('pagination-container')).toBeInTheDocument())
        
    })

})