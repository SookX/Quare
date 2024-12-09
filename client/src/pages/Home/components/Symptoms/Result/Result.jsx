import { Link } from "react-router-dom"

const Result = ({ result }) => {
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
    )
}

export default Result