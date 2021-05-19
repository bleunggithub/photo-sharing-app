
import { render, waitFor, cleanup } from '@testing-library/react';

import 'intersection-observer';
import axios from 'axios'
import { UserContext } from '../context/UserContext';
import App from '../App';

import {postDataFirst} from '../testData'

jest.mock('axios')
global.scrollTo = jest.fn()

afterEach(cleanup)

afterAll(() => {
  jest.resetModules()
  jest.restoreAllMocks()
});

describe("App component", () => {
  
  it('displays Loading when app first loads', () => {
    //! before promise is resolved (warning expected)
    axios.get.mockResolvedValueOnce({
      data: {
        authenticated: false,
        accessToken: ''
      }
    })
    const { getByTestId } = render(<App />)
    expect(getByTestId("loading")).toBeInTheDocument()
  })
  
  it('renders login form when data is returned from server (unauthenticated)', async() => {
    axios.get.mockResolvedValueOnce({
      data: {
        authenticated: false,
        accessToken: ''
      }
    })

    const { getByText, getByPlaceholderText } = render(<App />)
    
    //login form
    await waitFor(() => expect(getByPlaceholderText("username")).toBeInTheDocument())
    await waitFor(() => expect(getByPlaceholderText("password")).toBeInTheDocument())
    await waitFor(() => expect(getByText("InstaPic")).toBeInTheDocument())
  })
  
  it('renders "discover" when data is returned from server (authenticated)', async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        authenticated: true,
        accessToken: '1234'
      }
    }).mockResolvedValueOnce({
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
          <App />
        </UserContext.Provider>
    )
    
    //photo grid
    await waitFor(() => expect(getByTestId("discover-container")).toBeInTheDocument())
  })



})