import axios from "axios"
import { useState } from "react"
import { Link } from "react-router-dom"
import Loader from "../../../../../components/Loader/Loader"

const Result = ({ result }) => {
    // Holds the state of the request
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)



    // Makes a request to the backend to download the pdf
    const handlePDF = async () => {
        setLoading(true)

        let specialist = result.specialist
        let list_of_specialists = result.data
        const body = {
            disease: "Hemeroidi",
            specialist,
            list_of_specialists
        }

        const response = await axios.post('/download/', body)
        
        if(response.status == 200) {
            try {
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
            } catch(err) {
                setError("Couldn't download pdf. Try again.")
            }
        } else setError("Couldn't download pdf. Try again.")

        setLoading(false)
    }



    return (
        <div className="result-container">
            {
                loading &&
                <Loader />
            }

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
    )
}

export default Result