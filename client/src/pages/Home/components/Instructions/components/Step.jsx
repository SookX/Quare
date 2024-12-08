const Step = ({num, title, image}) => {
    return (
        <div className="step-container">
            <div className="step-box">
                <div className="heading-box">
                    <div className="step">Step {num}</div>
                    <h5 className="heading">{title}</h5>
                </div>
                <img src={image} alt="" className='image' />
            </div>

            <svg xmlns="http://www.w3.org/2000/svg" width={48} height={48} viewBox="0 0 24 24" className='arrow'><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m12 4l-6 6m6-6l6 6m-6-6v10.5m0 5.5v-2.5"></path></svg>
        </div>
    )
}

export default Step