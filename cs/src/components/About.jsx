import React from 'react'
import './About.css'
import { Clock } from 'lucide-react';
import { BarChart2 } from 'lucide-react';
import { UserCheck } from 'lucide-react';
import { Users } from 'lucide-react';



function About() {
  return (
   <div className="about-page">
    <div className="about-head">
        From Data to Decisions - Instantly
        <div className="about-subText">
           Discover how our platform leverages advanced intelligence to monitor, analyze, and combat anti-India sentiments across social media in real time. </div>  
    </div>


    <div className="about-cardCon">


          <div class="about-card">
  <div class="about-card-icon">
    <Clock size={32} />
  </div>
  <span class="about-card-badge">Core Product</span>
  <h2 class="about-card-title">Time-Based Posting Insights</h2>
  <p class="about-card-description">
    Analyze posting trends of anti-India content over time to detect peak activity and automate timely interventions. </p>
  <ul class="about-card-features">
    <li>Visualize hourly posting patterns</li>
    <li>Identify peak times of anti-India content</li>
    <li>Track changes over time for evolving behavior</li>
    <li>Support automated scheduling for monitoring</li>
  </ul>
  <button class="about-card-button">Learn More</button>
</div>

      <div class="about-card">
  <div class="about-card-icon">
    <BarChart2 size={32} />
  </div>
  <span class="about-card-badge">Core Product</span>
  <h2 class="about-card-title">Anti-India Content Distribution</h2>
  <p class="about-card-description">
   Understand where anti-India sentiment is concentrated across social media: users, posts, and comments. </p>
  <ul class="about-card-features">
    <li>Breakdown of content by entity type</li>
    <li>Measure volume of posts vs comments vs users</li>
    <li>Pinpoint high-risk content areas</li>
    <li>Prioritize actions based on distribution</li>
  </ul>
  <button class="about-card-button">Learn More</button>
</div>

      <div class="about-card">
  <div class="about-card-icon">
    <UserCheck size={32} />
  </div>
  <span class="about-card-badge">Core Product</span>
  <h2 class="about-card-title">Influential Flagged Users(Flow Control Index)</h2>
  <p class="about-card-description">
   Monitor top flagged users driving content propagation, ranked by their ability to influence information flow </p>
  <ul class="about-card-features">
    <li>Rank users by Flow Control Index</li>
    <li>Detect users with high influence on content spread</li>
    <li>Facilitate targeted moderation</li>
    <li>Disrupt coordinated disinformation efforts</li>
  </ul>
  <button class="about-card-button">Learn More</button>
</div>


      <div class="about-card">
  <div class="about-card-icon">
   <Users size={32} />
  </div>
  <span class="about-card-badge">Core Product</span>
  <h2 class="about-card-title">Influential Flagged Users (Proximity Centrality)</h2>
  <p class="about-card-description">
   Identify key flagged users central to the network, helping to focus resources on critical amplification nodes. </p>
  <ul class="about-card-features">
    <li>Highlight users central to interaction network</li>
    <li>Measure closeness to other users</li>
    <li>Understand user connectivity impact</li>
    <li>Inform network disruption strategies</li>
  </ul>
  <button class="about-card-button">Learn More</button>
</div>


    </div>
   </div>
  )
}

export default About
