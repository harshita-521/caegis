import React from 'react'
import './SearchPage.css'
import FloatingTweet from './FloatingTweet'
// import Typed from "react-typed";
import { ReactTyped } from "react-typed";

function SearchPage() {
    return (
        <div className="searchPage">

                <div className="head-text">
                    <div className="heading">
                        Blah Blah <span>{" "}
                         <ReactTyped
        strings={["Insights", "Real-Time Updates"]}
        typeSpeed={150}
        backSpeed={40}
        backDelay={1500}
        loop
      /></span>
                    </div>
                    <div className="heading-sub">
                        Real-time updates from social media
                    </div>
                </div>
                <div className="search-bar">
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search..."
                    />

                    <button>S</button>
                </div>

                <div className="floatingTw">
<FloatingTweet/>
            </div>

                <div className="card-container">
                    <div className="card1 card">
                        <div className="card-text">
                            <span>
                                Powerful, yet Simple to Use
                            </span>
                            <p>
                                Bring the power of AI and geospatial data to your fingertips with our intuitive interface.
                            </p>

                        </div>
                    </div>

                    <div className="card1 card">
                        <div className="card-text">
                            <span>
                                Powerful, yet Simple to Use
                            </span>
                            <p>
                                Bring the power of AI and geospatial data to your fingertips with our intuitive interface.
                            </p>

                        </div>
                    </div>

                    <div className="card1 card">
                        <div className="card-text">
                            <span>
                                Powerful, yet Simple to Use
                            </span>
                            <p>
                                Bring the power of AI and geospatial data to your fingertips with our intuitive interface.
                            </p>

                        </div>
                    </div>

                    <div className="card1 card">
                        <div className="card-text">
                            <span>
                                Powerful, yet Simple to Use
                            </span>
                            <p>
                                Bring the power of AI and geospatial data to your fingertips with our intuitive interface.
                            </p>

                        </div>
                    </div>
                </div>
            

        </div>
    )
}

export default SearchPage
