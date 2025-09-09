import React from 'react'
import './Homepage.css'
import { Link } from 'react-router-dom'
import About from './About'
import { ReactTyped } from "react-typed";
function Homepage() {
  return (
   <div className="homepage">
    <div className="homePageHead">
        CyberAegis
        <div>Discover how our platform leverages advanced intelligence to <div className='typed1'>
<ReactTyped
        strings={["Monitor", "Analyze","Combat Anti-India"]}
        typeSpeed={150}
        backSpeed={40}
        backDelay={1500}
        loop
      /> 
          </div>sentiments across social media in real time
        </div>
  
   <div className="btn">
<Link to='/search'>Get Started</Link>
    </div>
      </div>

      <div id="about-section">
        <About/>
      </div>
   </div>
  )
}

export default Homepage
