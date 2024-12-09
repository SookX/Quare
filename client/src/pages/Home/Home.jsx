import './home.less'
import Hero from "./components/Hero/Hero"
import Instructions from "./components/Instructions/Instructions"
import Symptoms from "./components/Symptoms/Symptoms"

const Home = () => {
    return (
        <>
            <Hero />
            <Instructions />
            <Symptoms />
        </>
    )
}

export default Home