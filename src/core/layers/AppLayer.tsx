// Application layer, general wrapper for Private routes
// import { Footer, Header } from '../../components/common'

const AppLayer: React.FC = ({ children }) => {

  return (
    <>
      {/*<div className='container'>*/}
      {/*  <Header  />*/}
      {/*    <div className='main'>*/}
            {children}
      {/*    </div>*/}
      {/*  <Footer />*/}
      {/*</div>*/}

    </>)
}

export default AppLayer
