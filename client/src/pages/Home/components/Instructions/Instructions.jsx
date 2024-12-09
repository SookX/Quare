import textarea1 from '../../../../img/textarea1.webp'
import textarea2 from '../../../../img/textarea2.webp'
import textarea3 from '../../../../img/textarea3.webp'
import Step from './components/Step'

const Instructions = () => {
    // Holds the instructions
    const instructions = [
        {
            title: "Click on the textarea",
            image: textarea1
        },
        {
            title: "Type a symptom and click Enter",
            image: textarea2
        },
        {
            title: "Enter all your symptoms",
            image: textarea3
        }
    ]



    return (
        <section className="instructions-section">
            {
                instructions.map((step, i) => (
                    <Step 
                        key={i}
                        num={i + 1}
                        title={step.title}
                        image={step.image}
                    />
                ))
            }
        </section>
    )
}

export default Instructions