import { useContext, useState } from "react"
import { DataContext } from "../../context/DataContext"
import './home.less'
import Hero from "./components/Hero/Hero"
import Instructions from "./components/Instructions/Instructions"

const Home = () => {
    // Gets global data from the context
    const { crud } = useContext(DataContext)



    // Holds the state for the form
    const [input, setInput] = useState('')



    // Holds the loading and error state
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)



    // Makes a request to the backend
    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)

        let question_list
        if(input) question_list = input.split(' ')
        else question_list = null

        console.log(question_list)

        const response = await crud({
            url: '/question/',
            method: 'post',
            body: {
                question_list
            }
        })

        console.log(response)

        setLoading(false)
    }



    // Makes a request to the backend to download the pdf
    const handlePDF = async () => {
        const response = await crud({
            url: '/download/',
            method: 'get'
        })

        console.log(response)

        const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(pdfBlob)
        console.log(url)

        const tempLink = document.createElement('a')
        tempLink.href = url
        tempLink.setAttribute(
            "download",
            `quareai-results.pdf`
        )

        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(url)
    }



    return (
        <>
            {/* <form onSubmit={(e) => handleSubmit(e)}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">Analyze</button>
            </form>
            <button onClick={handlePDF}>Download my results</button> */}
            <Hero />
            <Instructions />
        </>
    )
}

export default Home