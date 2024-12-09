import { useContext, useEffect, useState } from "react"
import { DataContext } from "../../../../context/DataContext"
import { IoClose } from "react-icons/io5";
import axios from "axios";
import Loader from "../../../../components/Loader/Loader";

const Symptoms = () => {
    // Gets global data from the context
    const { crud } = useContext(DataContext)



    // Holds the state for the form
    const [input, setInput] = useState('')
    const [question_list, setQuestionList] = useState([])
    const [city, setCity] = useState('Sofia')



    // Changes the input
    const handleInput = (e) => {
        if(e.key == 'Enter') {
            let symptom
            if(input[0] == '\n') symptom = input.split('\n')[1]
            else symptom = input
            setQuestionList([...question_list, symptom])
            setInput('')
        }
    }



    // Removes a symptom from the list
    const handleRemoveSymptom = (i) => {
        let newSymptoms = [...question_list]
        newSymptoms.splice(i, 1)
        setQuestionList(newSymptoms)
    }



    // Gets user's location
    const handleGetLocation = async () => {
        const success = async(pos) => {
            const {latitude, longitude} = pos.coords
            const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            if(response.status == 200) setCity(response.data.city)
            else setCity("Sofia")
        }

        const error = () => {
            setCity("Sofia")
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error)
        } else {
            setCity("Sofia")
        }
    }


    useEffect(() => {
        handleGetLocation()
    }, [])



    // Holds the loading and error state
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)



    // Makes a request to the backend
    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)

        const response = await crud({
            url: '/question/',
            method: 'post',
            body: {
                question_list,
                location: city
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
        <section className="symptoms-section">
            {
                loading &&
                <Loader />
            }

            <h3 className="heading">Quare.AI</h3>
            <p className="text">needs some information to analyze your health. Please write your symptoms as shown above.</p>

            <form className="form" onSubmit={(e) => handleSubmit(e)}>
                <div className="input-container">
                    <div className="symptom-box">
                        {
                            question_list.map((question, i) => (
                                <div className={`symptom symptom${(i % 7) + 1}`} key={i}>
                                    <p>{question}</p>
                                    <IoClose onClick={() => handleRemoveSymptom(i)} className="icon" />
                                </div>
                            ))
                        }
                    </div>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => handleInput(e)}
                        placeholder="Write your symptoms here..."
                    />
                </div>
                <button className="btn" type="submit">Analyze</button>
            </form>
            {/* <button onClick={handlePDF}>Download my results</button> */}
        </section>
    )
}

export default Symptoms