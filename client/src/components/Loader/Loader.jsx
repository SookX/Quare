import robot from '../../img/robot.webp'

const Loader = () => {
    return (
        <div className="overlay">
            <img src={robot} alt="Medical robot" className='loader-img' />
        </div>
    )
}

export default Loader