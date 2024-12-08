import { BrowserRouter, Routes, Route } from "react-router-dom"
import DataProvider from "./context/DataContext"
import LayoutGrid from "./components/LayoutGrid/LayoutGrid"
import Home from "./pages/Home"

function App() {

  return (
    <BrowserRouter>

      <DataProvider>

        <LayoutGrid type='screen' />

        <Routes>

          <Route path="/" element={<Home />} />

        </Routes>

      </DataProvider>

    </BrowserRouter>
  )
}

export default App
