import { render, waitFor, cleanup, screen, fireEvent } from '@testing-library/react';

import { MemoryRouter } from 'react-router-dom'

import 'intersection-observer';

import { UserContext } from '../context/UserContext';
import Share from '../Pages/Share';

URL.createObjectURL = jest.fn()

afterEach(cleanup)

afterAll(() => {
  jest.resetModules()
  jest.restoreAllMocks()
});

describe("Share page/ component", () => {
    beforeEach(() => {
        const user = {
            authenticated: true,
            accessToken: '1234'
            }
        const setUser = jest.fn()

        render(
            <UserContext.Provider value={{user, setUser}}>
                <MemoryRouter initialEntries={["/share"]}>
                    <Share />
                </MemoryRouter>
            </UserContext.Provider>
        )
    })

    it('renders without crashing', async () => {
        await waitFor(() => expect(screen.getByTestId("upload-container")).toBeInTheDocument())
        await waitFor(() => expect(screen.getByTestId("dropzone-container")).toBeInTheDocument())
        await waitFor(() => expect(screen.getByTestId("upload-textarea-container")).toBeInTheDocument())
        await waitFor(() => expect(screen.getByRole('button')).toHaveAttribute('type','submit'))
    })


    it('accepts file on drop', async () => {
        const image = new File(["aihgsldfgklsjdhfkgjasdflag234567"], "ThisIsAnImage.jpeg", { type: 'image/jpeg' })
        
        const mockData = (files) => {
            return {
                dataTransfer: {
                    files,
                    items: files.map(file => ({
                        kind: "file",
                        type: file.type,
                        getAsFile: () => file,
                    })),
                    types: ["Files"],
                },
            }
        }

        const data = mockData([image])

        const dispatchEvent = (node, type, data) => {
            const event = new Event(type, { bubbles: true })
            Object.assign(event, data)
            fireEvent.drop(node, event)
        }

        const zone = screen.getByTestId("drop-area")
        dispatchEvent(zone, "drop", data)
        await waitFor(()=> expect(screen.getByText(/ThisIsAnImage.jpeg/i)).toBeInTheDocument()) 
    })

})