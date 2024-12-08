import cross from "../../../../img/cross.webp"
import robot from "../../../../img/robot.webp"

const Hero = () => {
    return (
        <section className="hero-section">
            <div className="text-box">
                <div className="heading-box">
                    <h1 className="heading">Quare.AI</h1>
                    <img src={cross} alt="Medical Cross" className="logo" />
                </div>

                <p className="text">Easy and practical <span>medical AI</span>: simply type in the symptoms you're experiencing to receive a quick health analysis, personalized tips for improvement, and recommendations for the right specialists. You'll also get suggestions for nearby doctors based on your location, making it convenient to take the next steps for your health.</p>

                <button className="btn">Try it now</button>
            </div>

            <img src={robot} alt="Medical Robot" className="image" />
        </section>
    )
}

export default Hero