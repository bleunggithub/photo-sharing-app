import { render, waitFor, cleanup, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'

import 'intersection-observer';
import axios from 'axios'

import { UserContext } from '../context/UserContext';
import Discover from '../Pages/Discover';
import {postDataFirst, postDataSecond} from '../testData'
import userEvent from '@testing-library/user-event';

jest.mock('axios')

afterEach(cleanup)

afterAll(() => {
  jest.resetModules()
  jest.restoreAllMocks()
});

describe("Discover page/ component", () => {
    // Below warning appears in the console because of the fetch req on component mount
    //! Warning: An update to App inside a test was not wrapped in act(...).
    //! When testing, code that causes React state updates should be wrapped into act(...):....

    beforeEach(() => {
        axios.get.mockResolvedValueOnce({
            data: {
                posts: postDataFirst
            }
        })

        const user = {
            authenticated: true,
            accessToken: '1234'
            }
        const setUser = jest.fn()

        render(
            <UserContext.Provider value={{user, setUser}}>
                <MemoryRouter initialEntries={["/discover"]}>
                    <Discover />
                </MemoryRouter>
            </UserContext.Provider>
        )
    })

    it('renders without crashing', async () => {
        await waitFor(() => expect(screen.getByTestId("discover-container")).toBeInTheDocument())
        await waitFor(()=> expect(screen.getAllByRole('button')[0]).toHaveValue('asc'))
        await waitFor(()=> expect(screen.getAllByRole('button')[1]).toHaveValue('desc'))
        await waitFor(() => expect(screen.getByTestId("pic-grid-div")).toBeInTheDocument())
        await waitFor(()=> expect(screen.getByText(/Load More/i)).toBeInTheDocument())
    })


    it('sends get request when Load More button is clicked', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                posts: postDataSecond
            }
        })
        
        await waitFor(()=> expect(axios.get).toHaveBeenCalledTimes(1)) //on load
        act(() => {
            userEvent.click(screen.getByText(/Load More/i))
        })
        await waitFor(()=> expect(axios.get).toHaveBeenCalledTimes(2)) 
    })

    it("when scrolled to bottom, renders 'no more posts' text when it's the last page", async()=>{
        axios.get.mockResolvedValueOnce({
            data: {
                posts: postDataSecond,
                message: "This is the last page."
            },
        })

        act(() => {
            userEvent.click(screen.getByText(/Load More/i))
        })
        
        await waitFor(()=> expect(screen.getByText(/... No more posts/i)).toBeInTheDocument())
    })

})