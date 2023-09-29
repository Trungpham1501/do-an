import '../styles/globals.css'
import '../assets/fontawesome/css/all.min.css'
import { Provider } from 'react-redux'
import store from '../store'

import Navbar from '../components/Navbar/Navbar'
import Sidebar from '../components/Sidebar/Sidebar'
import Container from '../components/Container/Container'
import Footer from '../components/Footer/Footer'
import ToastMsg from '../components/ToastMsg/ToastMsg'

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ToastMsg />
      <Navbar />
      <Container>
        <Sidebar />
        <Component {...pageProps} />
        <Footer />
      </Container>
    </Provider>
  )
}

export default MyApp
