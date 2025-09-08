import React, { use, useCallback } from 'react'
import './SearchPage.css'
import FloatingTweet from './FloatingTweet'
// import Typed from "react-typed";
import { ReactTyped } from "react-typed";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse';
import Graph1 from './Graph1';
import HeatMapGraph from './HeatMapGraph';
import Graph2 from './Graph2';
import MyWordCloud from './WordCloud';
import NetworkGraph from './Network';

function SearchPage() {
    const [users , setUsers] = useState([]) ; 
    const [edges , setEdges] = useState([]) ; 
    const [centralityData, setCentralityData] = useState([]); // Store betweenness centrality results
    const [closenessData, setClosenessData] = useState([]); // Store closeness centrality results

    const [tweets , setTweets] =useState([]); 
    const [userData  , setUserData] = useState([]);
    const [searchTerm , setSearchTerm] = useState([]);

    const loadCSV = async () => {
        try {
            console.log("Starting to load CSV files...");
            
            // Load users.csv
            const usersRes = await fetch("/users.csv");
            console.log("Users response status:", usersRes.status, usersRes.ok);
            
            if (usersRes.ok) {
                const usersText = await usersRes.text();
                console.log("Users CSV text length:", usersText.length);
                console.log("First 200 chars of users CSV:", usersText.substring(0, 200));
                
                const parsedUsers = Papa.parse(usersText, { 
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: header => header.trim()
                });
                
                console.log("Parsed users data:", parsedUsers);
                console.log("Users data length:", parsedUsers.data.length);
                console.log("Users errors:", parsedUsers.errors);
                
                setUsers(parsedUsers.data);
            } else {
                console.error("Failed to fetch users.csv, status:", usersRes.status);
            }

            // Load edges.csv
            const edgesRes = await fetch("/edges.csv");
            console.log("Edges response status:", edgesRes.status, edgesRes.ok);
            
            if (edgesRes.ok) {
                const edgesText = await edgesRes.text();
                console.log("Edges CSV text length:", edgesText.length);
                console.log("First 200 chars of edges CSV:", edgesText.substring(0, 200));
                
                const parsedEdges = Papa.parse(edgesText, { 
                    header: true,
                    skipEmptyLines: true,
                    transformHeader: header => header.trim()
                });
                
                console.log("Parsed edges data:", parsedEdges);
                console.log("Edges data length:", parsedEdges.data.length);
                console.log("Edges errors:", parsedEdges.errors);
                
                setEdges(parsedEdges.data);
            } else {
                console.error("Failed to fetch edges.csv, status:", edgesRes.status);
            }

        } catch (err) {
            console.error("Error loading CSVs:", err);
        }
    };

    // Function to calculate betweenness centrality
    const calculateBetweennessCentrality = () => {
        if (!users.length || !edges.length) {
            console.warn("Users or edges data not loaded yet");
            return [];
        }

        try {
            // Create adjacency list representation of the graph
            const graph = {};
            const userMap = {};

            // Initialize graph with all users
            users.forEach(user => {
                if (user.user_id) {
                    const userId = user.user_id.toString().trim();
                    graph[userId] = [];
                    userMap[userId] = {
                        username: userId,
                        flagged: user.flagged === "1"
                    };
                }
            });

            // Add edges to the graph
            edges.forEach(edge => {
                const source = edge.source.toString().trim();
                const target = edge.target.toString().trim();
                
                if (graph[source] && graph[target]) {
                    graph[source].push(target);
                    graph[target].push(source); // Assuming undirected graph
                }
            });

            const nodes = Object.keys(graph);
            const betweenness = {};

            // Initialize betweenness scores to 0
            nodes.forEach(node => {
                betweenness[node] = 0;
            });

            // Calculate betweenness centrality using Brandes' algorithm (simplified)
            nodes.forEach(s => {
                const stack = [];
                const predecessors = {};
                const distance = {};
                const sigma = {};
                const delta = {};

                // Initialize
                nodes.forEach(w => {
                    predecessors[w] = [];
                    distance[w] = -1;
                    sigma[w] = 0;
                    delta[w] = 0;
                });

                distance[s] = 0;
                sigma[s] = 1;
                const queue = [s];

                // BFS to find shortest paths
                while (queue.length > 0) {
                    const v = queue.shift();
                    stack.push(v);

                    graph[v].forEach(w => {
                        // First time we found shortest path to w?
                        if (distance[w] < 0) {
                            queue.push(w);
                            distance[w] = distance[v] + 1;
                        }

                        // Shortest path to w via v?
                        if (distance[w] === distance[v] + 1) {
                            sigma[w] += sigma[v];
                            predecessors[w].push(v);
                        }
                    });
                }

                // Accumulation phase
                while (stack.length > 0) {
                    const w = stack.pop();
                    predecessors[w].forEach(v => {
                        delta[v] += (sigma[v] / sigma[w]) * (1 + delta[w]);
                    });
                    if (w !== s) {
                        betweenness[w] += delta[w];
                    }
                }
            });

            // Normalize betweenness centrality
            const n = nodes.length;
            const normalizationFactor = n > 2 ? 2 / ((n - 1) * (n - 2)) : 1;

            // Create result array with username, score, and flagged status
            const result = nodes.map(userId => ({
                username: userMap[userId].username,
                score: (betweenness[userId] * normalizationFactor).toFixed(4),
                flaggedStatus: userMap[userId].flagged
            }));

            // Sort by score in descending order
            result.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

            console.log("Betweenness Centrality Results:", result);
            return result;

        } catch (error) {
            console.error("Error calculating betweenness centrality:", error);
            return [];
        }
    };

    // Function to calculate closeness centrality
    const calculateClosenessCentrality = () => {
        if (!users.length || !edges.length) {
            console.warn("Users or edges data not loaded yet");
            return [];
        }

        try {
            // Create adjacency list representation of the graph
            const graph = {};
            const userMap = {};

            // Initialize graph with all users
            users.forEach(user => {
                if (user.user_id) {
                    const userId = user.user_id.toString().trim();
                    graph[userId] = [];
                    userMap[userId] = {
                        username: userId,
                        flagged: user.flagged === "1"
                    };
                }
            });

            // Add edges to the graph
            edges.forEach(edge => {
                const source = edge.source.toString().trim();
                const target = edge.target.toString().trim();
                
                if (graph[source] && graph[target]) {
                    graph[source].push(target);
                    graph[target].push(source); // Assuming undirected graph
                }
            });

            const nodes = Object.keys(graph);
            const closeness = {};

            // Calculate closeness centrality for each node
            nodes.forEach(startNode => {
                const distances = {};
                const visited = new Set();
                const queue = [{ node: startNode, distance: 0 }];
                
                // Initialize distances
                nodes.forEach(node => {
                    distances[node] = Infinity;
                });
                distances[startNode] = 0;

                // BFS to find shortest distances to all other nodes
                while (queue.length > 0) {
                    const { node: currentNode, distance } = queue.shift();
                    
                    if (visited.has(currentNode)) continue;
                    visited.add(currentNode);

                    graph[currentNode].forEach(neighbor => {
                        const newDistance = distance + 1;
                        if (newDistance < distances[neighbor]) {
                            distances[neighbor] = newDistance;
                            queue.push({ node: neighbor, distance: newDistance });
                        }
                    });
                }

                // Calculate closeness centrality
                // Sum of shortest distances to all other reachable nodes
                let totalDistance = 0;
                let reachableNodes = 0;
                
                nodes.forEach(node => {
                    if (node !== startNode && distances[node] !== Infinity) {
                        totalDistance += distances[node];
                        reachableNodes++;
                    }
                });

                // Closeness centrality = (n-1) / sum of distances
                // where n-1 is the number of other nodes
                if (totalDistance > 0 && reachableNodes > 0) {
                    closeness[startNode] = reachableNodes / totalDistance;
                } else {
                    closeness[startNode] = 0; // Isolated node
                }
            });

            // Normalize closeness centrality (optional)
            const maxCloseness = Math.max(...Object.values(closeness));
            if (maxCloseness > 0) {
                Object.keys(closeness).forEach(node => {
                    closeness[node] = closeness[node] / maxCloseness;
                });
            }

            // Create result array with username, score, and flagged status
            const result = nodes.map(userId => ({
                username: userMap[userId].username,
                score: closeness[userId].toFixed(4),
                flaggedStatus: userMap[userId].flagged
            }));

            // Sort by score in descending order
            result.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

            console.log("Closeness Centrality Results:", result);
            return result;

        } catch (error) {
            console.error("Error calculating closeness centrality:", error);
            return [];
        }
    };


    useEffect(()=>{
        loadCSV() ;
        
    }, [])  ; 
    useEffect(() => {
    console.log("Updated Users:", users);
    // Calculate centrality when users data is updated
    if (users.length > 0 && edges.length > 0) {
        const centralityResults = calculateBetweennessCentrality();
        const closenessResults = calculateClosenessCentrality();
        setCentralityData(centralityResults); // Store betweenness in state
        setClosenessData(closenessResults); // Store closeness in state
        console.log("Auto-calculated betweenness centrality:", centralityResults);
        console.log("Auto-calculated closeness centrality:", closenessResults);
    }
    }, [users]);

    useEffect(() => {
    console.log("Updated Edges:", edges);
    // Calculate centrality when edges data is updated
    if (users.length > 0 && edges.length > 0) {
        const centralityResults = calculateBetweennessCentrality();
        const closenessResults = calculateClosenessCentrality();
        setCentralityData(centralityResults); // Store betweenness in state
        setClosenessData(closenessResults); // Store closeness in state
        console.log("Auto-calculated betweenness centrality:", centralityResults);
        console.log("Auto-calculated closeness centrality:", closenessResults);
    }
    }, [edges]);

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

    useEffect(() => {
        console.log("Updated centralityData:", centralityData);
        console.log("Flagged users count:", centralityData.filter(user => user.flaggedStatus === true).length);
    }, [centralityData]);

    useEffect(() => {
        console.log("Updated closenessData:", closenessData);
    }, [closenessData]);

    const [ radio , setRadio] = useState("Keywords");

    const handleSearch = async () => {
        try {
            const itemsArray = searchTerm
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
            console.log("Search Term Array:", itemsArray);
            if (radio === "Keywords") {
            const res = await axios.post("http://135.235.216.119/search/keywords", {
                keywords: itemsArray,
                num_posts: 5,
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
                    
                <div  className="floatingTw" >
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
                            <NetworkGraph />
                        </div>
                    </div>
                    
                    <div className="card1 card">
                        <div className="card-text">
                            <div style={{ padding: '20px' }}>
                                <h3 style={{ 
                                    color: 'white', 
                                    marginBottom: '15px',
                                    textAlign: 'center',
                                    fontSize: '18px'
                                }}>
                                    Top 7 Flagged Users - Betweenness Centrality
                                </h3>
                                <div style={{ 
                                    maxHeight: '300px', 
                                    overflowY: 'auto', 
                                    backgroundColor: 'rgba(255,255,255,0.1)', 
                                    borderRadius: '8px', 
                                    padding: '15px' 
                                }}>
                                    {centralityData && centralityData.length > 0 ? (
                                        centralityData
                                            .filter(user => user.flaggedStatus === true)
                                            .slice(0, 7)
                                            .map((user, index) => (
                                                <div key={index} style={{
                                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                                    margin: '8px 0',
                                                    padding: '12px',
                                                    borderRadius: '6px',
                                                    color: 'white',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    border: '1px solid rgba(255,255,255,0.2)'
                                                }}>
                                                    <span style={{ 
                                                        fontWeight: 'bold',
                                                        fontSize: '16px',
                                                        color: '#ffdd44'
                                                    }}>
                                                        #{index + 1}
                                                    </span>
                                                    <span style={{ 
                                                        flex: 1, 
                                                        marginLeft: '15px',
                                                        fontSize: '14px'
                                                    }}>
                                                        {user.username}
                                                    </span>
                                                    <span style={{ 
                                                        backgroundColor: 'rgba(255,0,0,0.4)', 
                                                        padding: '4px 8px', 
                                                        borderRadius: '4px',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {user.score}
                                                    </span>
                                                </div>
                                            ))
                                    ) : (
                                        <div style={{ 
                                            color: 'white', 
                                            textAlign: 'center', 
                                            padding: '30px',
                                            fontSize: '14px'
                                        }}>
                                            Loading centrality data...
                                        </div>
                                    )}
                                    {centralityData && centralityData.filter(user => user.flaggedStatus === true).length === 0 && (
                                        <div style={{ 
                                            color: 'white', 
                                            textAlign: 'center', 
                                            padding: '30px',
                                            fontSize: '14px'
                                        }}>
                                            No flagged users found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            

        </div>
    )
}

export default SearchPage ; 
