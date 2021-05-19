import { render, waitFor, cleanup, act,screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'

import 'intersection-observer'
import axios from 'axios'
import { MemoryRouter } from 'react-router-dom'

import UserProvider from '../context/UserContext'
import Routes from '../Routes'
import { postDataFirst } from '../testData'

jest.mock('axios')
global.scrollTo = jest.fn()

afterEach(cleanup)

afterAll(() => {
  jest.resetModules()
  jest.restoreAllMocks()
});

describe("Log in & Log out", () => {
    beforeAll(() => {
        axios.get.mockResolvedValueOnce({
            data: {
                authenticated: false,
                accessToken: ''
            }
        })
    
        render(
            <UserProvider>
                <MemoryRouter>
                    <Routes />
                </MemoryRouter>
            </UserProvider>
        )
    })

    it('logs user in and redirect to "/discover", logs user out and redirect to "/"', async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                posts: postDataFirst
            }
            }).mockResolvedValueOnce({
            data: {
                message:"logged out successfully."
            }
            })
        axios.post.mockResolvedValueOnce({
            data: {
                authenticated: false,
                accessToken: '1234'
            }
        })
        await waitFor(() => expect(screen.getByTestId("login-container")).toBeInTheDocument())
        // log in
        act(() => {
            userEvent.type(screen.getByPlaceholderText('username'), 'username')
            userEvent.type(screen.getByPlaceholderText('password'), 'password')
            userEvent.click(screen.getByTestId('login-btn'))
        })
        //redirect to discover page
        await waitFor(() => expect(screen.getByTestId("discover-container")).toBeInTheDocument())
        //log out
        act(() => {
            userEvent.click(screen.getByTestId('logout-btn'))
        })
        //redirect to log in page
        await waitFor(() => expect(screen.getByTestId("login-container")).toBeInTheDocument())
    })
})