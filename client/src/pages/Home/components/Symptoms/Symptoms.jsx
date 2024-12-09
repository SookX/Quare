import { useState } from "react";
import Result from "./Result/Result";
import Form from "./Form/Form";

const Symptoms = () => {
    // Holds the result from the form
    const [result, setResult] = useState(null)



    return (
        <section className={`symptoms-section ${result ? 'symptoms-grid' : null}`} id="form">
            <Form setResult={setResult} />

            {
                result &&
                <Result result={result} />
            }
        </section>
    )
}

export default Symptoms