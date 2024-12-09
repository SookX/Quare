import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home/Home"
import axios from "axios"

function App() {
  // Sets the url for the backend server
  axios.defaults.baseURL = 'http://127.0.0.1:8000/api'

  
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App
