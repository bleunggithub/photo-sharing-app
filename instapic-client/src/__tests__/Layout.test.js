import { render, waitFor, cleanup, fireEvent } from '@testing-library/react';

import 'intersection-observer';
import axios from 'axios'
import { MemoryRouter } from 'react-router-dom'

import { UserContext } from '../context/UserContext';
import {postDataFirst} from '../testData'
import Routes from '../Routes';

jest.mock('axios')
global.scrollTo = jest.fn()

afterEach(cleanup)

afterAll(() => {
  jest.resetModules()
  jest.restoreAllMocks()
});

describe("Layout (menu)", () => {
    it('all private routes should show the menu', async () => {
        axios.get.mockResolvedValue({
            data: {
                posts: postDataFirst
            }
        })

        const user = {
            authenticated: true,
            accessToken: '1234'
            }
        const setUser = jest.fn()
        
        
        const { getByTestId } = render(
            <UserContext.Provider value={{user, setUser}}>
                <MemoryRouter initialEntries={["/discover"]}>
                    <Routes />
                </MemoryRouter>
            </UserContext.Provider>
        )

        await waitFor(() => expect(getByTestId("navbar")).toBeInTheDocument())
        fireEvent(getByTestId("search-btn"),new MouseEvent('click', {bubbles:true}))
        //showing search page
        await waitFor(() => expect(getByTestId("search-container")).toBeInTheDocument())
        await waitFor(() => expect(getByTestId("navbar")).toBeInTheDocument())
        fireEvent(getByTestId("discover-btn"),new MouseEvent('click', {bubbles:true}))
        //showing discover page
        await waitFor(() => expect(getByTestId("discover-container")).toBeInTheDocument())
        await waitFor(() => expect(getByTestId("navbar")).toBeInTheDocument())
        fireEvent(getByTestId("share-btn"),new MouseEvent('click', {bubbles:true}))
        // showing upload page
        await waitFor(() => expect(getByTestId("upload-container")).toBeInTheDocument())
        await waitFor(() => expect(getByTestId("navbar")).toBeInTheDocument())
    })
    


})