import { render, waitFor, cleanup } from '@testing-library/react'

import PicGrid from '../Components/PicGrid'
import {postDataFirst} from '../testData'
import userEvent from '@testing-library/user-event'

import 'intersection-observer'

afterEach(cleanup)

afterAll(() => {
  jest.resetModules()
  jest.restoreAllMocks()
});

describe("PicGrid component", () => {

    it('renders "No posts to show. :(" text when props.status === "NO RESULTS"', async () => {
        const { getByText,queryAllByTestId } = render(<PicGrid posts={[]} status="NO RESULTS" />)
        
        await waitFor(() => expect(getByText("No posts to show. :(")).toBeInTheDocument())
        await waitFor(()=> expect(queryAllByTestId("grid-img").length).toBe(0))
    })

    it('shows text div when hovered', async () => {
        const { getAllByAltText,getByText } = render(<PicGrid posts={postDataFirst} status="FETCHED" />)
        userEvent.hover(getAllByAltText('1')[0])
        await waitFor(() => expect(getByText("post1")).toBeInTheDocument())
    })

})