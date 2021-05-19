import { render, waitFor, cleanup, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom'

import 'intersection-observer';
import axios from 'axios'

import { UserContext } from '../context/UserContext';
import Login from '../Pages/Login';

jest.mock('axios')

afterEach(cleanup)

afterAll(() => {
  jest.resetModules()
  jest.restoreAllMocks()
});

describe("Login page/ component", () => {
    beforeEach(() => {
        
        const user = null
        const setUser = jest.fn()
        render(
            <UserContext.Provider value={{ user, setUser }}>
                <MemoryRouter initialEntries={["/"]}>
                    <Login />
                </MemoryRouter>
            </UserContext.Provider>
        )
    })

    it('renders without crashing', async () => {
        await waitFor(() => expect(screen.getByTestId("login-container")).toBeInTheDocument())
        await waitFor(() => expect(screen.getByPlaceholderText("username")).toBeInTheDocument())
        await waitFor(() => expect(screen.getByPlaceholderText("password")).toBeInTheDocument())
        await waitFor(() => expect(screen.getByTestId("login-btn")).toBeInTheDocument())
    })


    it('does not render `<Layout />`', async () => {
        await waitFor(() => expect(screen.queryByTestId("navbar")).not.toBeInTheDocument())
    })

    it('switches content when "switch form" link is clicked', async () => {
        act(() => {
            userEvent.click(screen.getByText(/Register here/i))
        })
        await waitFor(() => expect(screen.getByTestId("form-title").textContent).toMatch(/Register/i))
    })

    it('sends an POST request when submit button is clicked', async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                authenticated: false,
                accessToken: '1234'
            }
        })
        
        act(() => {
            userEvent.type(screen.getByPlaceholderText('username'), 'username')
            userEvent.type(screen.getByPlaceholderText('password'), 'password')
            userEvent.click(screen.getByTestId('login-btn'))
        })
        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1))
    })

    it('shows error message when there is any', async () => {
        axios.post.mockResolvedValueOnce({
            data: {
                message: [{ message: "Your password is incorrect"}]
            }
        })
        
        act(() => {
            userEvent.type(screen.getByPlaceholderText('username'), 'username')
            userEvent.type(screen.getByPlaceholderText('password'), 'password')
            userEvent.click(screen.getByTestId('login-btn'))
        })
        await waitFor(() => expect(screen.getByText(/Your password is incorrect/i)).toBeInTheDocument())
    })
})