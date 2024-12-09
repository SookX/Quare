import { useEffect, useState } from "react"
import { IoClose } from "react-icons/io5";
import axios from "axios";
import Loader from "../../../../components/Loader/Loader";
import { Link } from "react-router-dom";

const Symptoms = () => {
    // Holds the state for the form
    const [input, setInput] = useState('')
    const [question_list, setQuestionList] = useState([])
    const [city, setCity] = useState('Sofia')
    const [result, setResult] = useState(null)



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

        const response = await axios.post('/question/', {
                question_list,
                location: city
        })


        if(response.status == 200) {
            setError(null)
            setResult(response.data)
        } else setError(response.response.data.error)

        setLoading(false)
    }



    // Makes a request to the backend to download the pdf
    const handlePDF = async () => {
        let specialist = result.specialist
        let list_of_specialists = result.data
        const body = {
            disease: "Hemeroidi",
            specialist,
            list_of_specialists
        }

        console.log(body)

        const response = await axios.get('/download/', body)


        const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
        const url = window.URL.createObjectURL(pdfBlob)

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
        <section className={`symptoms-section ${result ? 'symptoms-grid' : null}`} id="form">
            {
                loading &&
                <Loader />
            }
            <div className="form-container">
                <h3 className="heading">Quare.AI</h3>
                <p className="text">needs some information to analyze your health. Please write your symptoms as shown above.</p>

                {
                    error &&
                    <p className="error">{error}</p>
                }

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
            </div>

            {
                result &&
                <div className="result-container">
                    <h4 className="heading">{result.specialist}s near you</h4>

                    <div className="doctor-container">
                        {
                            result &&
                            result.data.map((doctor, i) => (
                                <Link to={doctor.website} target="_blank" className="doctor" key={i}>
                                    <h5 className="heading">{doctor.name}</h5>
                                    <p className="address">{doctor.address}</p>
                                    <div className="rating-box">
                                        <p className="rating">Rating {doctor.rating}</p>
                                        <p className="reviews">{doctor.reviews_count} Reviews</p>
                                    </div>
                                </Link>
                            ))
                        }
                    </div>

                    <button onClick={handlePDF} className="btn">Download my results</button>
                </div>
            }
        </section>
    )
}

export default Symptoms