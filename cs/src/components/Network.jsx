import React, { useEffect, useState, useRef } from "react";
import zc from "@dvsl/zoomcharts";
import Papa from "papaparse";

function NetworkGraph() {
  const chartRef = useRef(null);
  const netChartInstance = useRef(null);

  useEffect(() => {
    async function loadData() {
      try {
        // Load users
        const usersText = await (await fetch("/users.csv")).text();
        const users = Papa.parse(usersText, { header: true }).data;

        // Keep first 50 valid users
        const validUsers = users.filter(u => u.user_id).slice(0, 50);

        // Create nodes
        const nodes = validUsers.map(u => ({
          id: u.user_id.trim(),
          name: u.user_id.trim(),
          style: {
            fillColor: u.flagged === "1" ? "#FF4136" : "#0074D9",
            radius: u.flagged === "1" ? 30 : 20
          }
        }));

        const allowedIds = new Set(nodes.map(n => n.id));

        // Load edges
        const edgesText = await (await fetch("/edges.csv")).text();
        const edges = Papa.parse(edgesText, { header: true }).data;

        // Filter edges to include only nodes in the top 50
        const links = edges
          .filter(e => e.source && e.target)
          .filter(e => allowedIds.has(e.source.trim()) && allowedIds.has(e.target.trim()))
          .map((e, i) => ({
            id: `e${i}`,
            from: e.source.trim(),
            to: e.target.trim(),
            style: {
              fillColor: "#2ECC40", // Green color for connections
              lineColor: "#2ECC40",
              lineWidth: 2
            }
          }));

        // Destroy previous chart if it exists
        if (netChartInstance.current) netChartInstance.current.destroy();

        // Initialize chart
        netChartInstance.current = new zc.NetChart({
          container: chartRef.current,
          data: { preloaded: { nodes, links } },
          layout: { mode: "force" },
          node: { label: { field: "name" } },
          link: { 
            arrows: true,
            style: {
              fillColor: "#2ECC40", // Green connections
              lineColor: "#2ECC40",
              lineWidth: 3
            }
          },
          interaction: { zooming: true, dragging: true }
        });

      } catch (err) {
        console.error("Error loading network data:", err);
      }
    }

    loadData();
  }, []);

  return <div ref={chartRef} style={{ width: "1100px", height: "400px" }} />;
}

export default NetworkGraph;
  