import { render, waitFor, cleanup } from '@testing-library/react';

import { UserContext } from '../context/UserContext';
import Routes from '../Routes';
import {postDataFirst} from '../testData'
import { MemoryRouter } from 'react-router-dom'

import 'intersection-observer';
import axios from 'axios'

jest.mock('axios')
global.scrollTo = jest.fn()

afterEach(cleanup)

afterAll(() => {
  jest.resetModules()
  jest.restoreAllMocks()
});

describe("Routes & PrivateRoutes", () => {
    
    it('renders `<Login />` when component mounts ("/") (unauthenticated)', async () => {
        const { getByPlaceholderText, getByText } = render(
            <MemoryRouter initialEntries={["/"]}>
                <Routes />
            </MemoryRouter>
        )
        
        await waitFor(() => expect(getByPlaceholderText("username")).toBeInTheDocument())
        await waitFor(() => expect(getByPlaceholderText("password")).toBeInTheDocument())
        await waitFor(() => expect(getByText("InstaPic")).toBeInTheDocument())
    })

    it('renders `<Login />` when navigated to "/discover" (unauthenticated)', async () => {
        const user = null
        const setUser = jest.fn()
        
        const { getByPlaceholderText, getByText } = render(
            <UserContext.Provider value={{user, setUser}}>
                <MemoryRouter initialEntries={["/discover"]}>
                    <Routes />
                </MemoryRouter>
            </UserContext.Provider>
        )

        await waitFor(() => expect(getByPlaceholderText("username")).toBeInTheDocument())
        await waitFor(() => expect(getByPlaceholderText("password")).toBeInTheDocument())
        await waitFor(() => expect(getByText("InstaPic")).toBeInTheDocument())
    })

    it('renders `<Login />` when navigated to "/share" (unauthenticated)', async () => {
        const user = null
        const setUser = jest.fn()
        
        const { getByPlaceholderText, getByText } = render(
            <UserContext.Provider value={{user, setUser}}>
                <MemoryRouter initialEntries={["/share"]}>
                    <Routes />
                </MemoryRouter>
            </UserContext.Provider>
        )

        await waitFor(() => expect(getByPlaceholderText("username")).toBeInTheDocument())
        await waitFor(() => expect(getByPlaceholderText("password")).toBeInTheDocument())
        await waitFor(() => expect(getByText("InstaPic")).toBeInTheDocument())
    })

    it('renders `<Login />` when navigated to "/search" (unauthenticated)', async () => {
        const user = null
        const setUser = jest.fn()
        
        const { getByPlaceholderText, getByText } = render(
            <UserContext.Provider value={{user, setUser}}>
                <MemoryRouter initialEntries={["/search"]}>
                    <Routes />
                </MemoryRouter>
            </UserContext.Provider>
        )

        await waitFor(() => expect(getByPlaceholderText("username")).toBeInTheDocument())
        await waitFor(() => expect(getByPlaceholderText("password")).toBeInTheDocument())
        await waitFor(() => expect(getByText("InstaPic")).toBeInTheDocument())
    })

    it('renders `<Discover />` when navigated to "/" (authenticated)', async () => {
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
        
        
        const { getByTestId } = render(
            <UserContext.Provider value={{user, setUser}}>
                <MemoryRouter initialEntries={["/discover"]}>
                    <Routes />
                </MemoryRouter>
            </UserContext.Provider>
        )

        await waitFor(() => expect(getByTestId("discover-container")).toBeInTheDocument())
    })

})