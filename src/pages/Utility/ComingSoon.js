import React from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col, Button } from "reactstrap"

//Import Countdown
import Countdown from "react-countdown"

//Import Images
import logo from "../../assets/images/kobermart-logo-white.svg"
import logoOriginal from "../../assets/images/kobermart-logo-original.png"
import maintanence from "../../assets/images/coming-soon.svg"

const PagesComingsoon = () => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <span>You are good to go!</span>
    } else {
      return (
        <>
          <div className="coming-box">
            {days} <span>Days</span>
          </div>{" "}
          <div className="coming-box">
            {hours} <span>Hours</span>
          </div>{" "}
          <div className="coming-box">
            {minutes} <span>Minutes</span>
          </div>{" "}
          <div className="coming-box">
            {seconds} <span>Seconds</span>
          </div>
        </>
      )
    }
  }

    //meta title
    document.title = "Coming Soon | Kobermart";

  return (
    <React.Fragment>
      <div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-white">
          <i className="fas fa-home h2" />
        </Link>
      </div>

      <div className="my-5 pt-sm-5">
        <Container>
          <Row>
            <Col lg="12">
              <div className="text-center">
                <Link to="/dashboard" className="d-block logo logo-dark">
                <span className="logo-lg">
                <img src={logoOriginal} alt="logo" height="90" />
                  </span>
                </Link>
                
                {/* <Row className="justify-content-center mt-5">
                  <Col sm="4">
                    <div className="maintenance-img">
                      <img
                        src={maintanence}
                        alt=""
                        className="img-fluid mx-auto d-block"
                      />
                    </div>
                  </Col>
                </Row> */}
                <Link to="/login" className="d-block auth-logo mt-3">
                  <Button>
                    Login Admin
                  </Button>
                </Link>
                <Link to="/privacy-policy" className="d-block auth-logo mt-3">
                  Privacy Policy
                </Link>
                <h4 className="mt-5">Selamat datang di Kobermart</h4>
                <p className="text-muted">
                  Layanan kami akan segera aktif, mohon kembali lagi setelah...
                </p>
                <Row className="justify-content-center mt-5">
                  <Col md="8">
                    <div className="counter-number">
                      <Countdown date="2023/01/01" renderer={renderer} />
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  )
}

export default PagesComingsoon
