import Header from './pages/Header'
import Footer from './pages/Footer'
import Routers from './Routes/Router'
import "./App.css";

function App()
{

  return (
    <>
      <Header />
      <main>
        <Routers />
      </main>
      <Footer />
    </>
  )
}

export default App
