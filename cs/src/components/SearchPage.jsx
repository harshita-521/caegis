import React, { use, useCallback } from 'react'
import './SearchPage.css'
import FloatingTweet from './FloatingTweet'
// import Typed from "react-typed";
import { ReactTyped } from "react-typed";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Graph1 from './Graph1';
import HeatMapGraph from './HeatMapGraph';
import Graph2 from './Graph2';
import MyWordCloud from './WordCloud';

function SearchPage() {
    const [tweets , setTweets] =useState([]); 
    const [userData  , setUserData] = useState([]);
    const [searchTerm , setSearchTerm] = useState([]);
    const fetchDefaultTweets = async () => {
        try {
            const res = await axios.get("http://135.235.216.119/search/scheduled/data");
            setTweets(res.data.result_data);
            setUserData(res.data.user_activity_data);

            
        } catch (error) {
            console.error("Error fetching default tweets:", error);
        }
    }
    useEffect(() => {
        fetchDefaultTweets();
    }, []); // empty deps → only once

    // Debug when state updates
    useEffect(() => {
        console.log("Updated tweets:", typeof(tweets['0']));

    }, [tweets]);

    useEffect(() => {
        console.log("Updated userData:", userData);
    }, [userData]);

    const [ radio , setRadio] = useState("Keywords");

    const handleSearch = async () => {
        try {
            const itemsArray = searchTerm
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
            console.log("Search Term Array:", itemsArray);
            if (radio === "Keywords") {
            const res = await axios.post("http://localhost:8000/search/keywords", {
                keywords: itemsArray,
                num_posts: 50,
                num_comments: 10,
            });

            setTweets(res.data.result_data);
            setUserData(res.data.user_activity_data);
            console.log("Response data:", res.data.result_data);
            } else {
            const res = await axios.post("http://135.235.216.119/search/users/bulk", {
                user_ids: itemsArray,
            });

            setTweets(res.data.result_data);
            setUserData(res.data.user_activity_data);
            console.log("Response data:", res.data.result_data);
            }
        } catch (error) {
            console.error("Error during search:", error);
        }
    };

    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        
    };


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
                        onChange={ handleChange}
                    />

                    <button
                    onClick={handleSearch}
                    >
                    S</button>
                </div>
                <div style={{color : "white" , marginTop : "10px" , marginBottom : "10px" 
                    , display : "flex" , justifyContent : "center"
                }}>
                    <label>
                <input type = "radio" value={"Keywords"} name = "searchType" 
                checked={radio === "Keywords"}
                onChange = {(e) => setRadio(e.target.value)}
                />
                Keywords
                </label>
                <label>
                <input type = "radio" value={"User"} name = "searchType" 
                checked={radio === "User"}
                onChange = {(e) => setRadio(e.target.value)}
                />
                User
                </label>


                </div>

                <div className="floatingTw">
<FloatingTweet tweets={tweets} user_data={userData} />


            </div>

                <div className="card-container">
                    <div className="card1 card">
                        <div className="card-text">
                           <Graph1 tweets={tweets} />

                        </div>
                    </div>

                    <div className="card1 card">
                        <div className="card-text">
                           
                        
                       <HeatMapGraph tweets={tweets} />
                        </div>
                        
                    </div>

                    <div className="card1 card">
                        <div className="card-text">
                           <Graph2 tweets={tweets}/>

                        </div>
                    </div>

                    <div className="card1 card">
                        <div className="card-text">
                            <MyWordCloud tweets={tweets} />

                        </div>
                    </div>
                    <div className="card1 card">
                        <div className="card-text">
                            <MyWordCloud tweets={tweets} />

                        </div>
                    </div>
                </div>
            

        </div>
    )
}

export default SearchPage
