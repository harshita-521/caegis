import React, { useEffect, useState } from "react";
import { NetChart } from "@zoomcharts/zoomcharts";
import Papa from "papaparse";

function NetworkGraph() {
  const [chartData, setChartData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    async function loadData() {
      try {
        const usersRes = await fetch("/users.csv");
        const usersText = await usersRes.text();
        const users = Papa.parse(usersText, { header: true }).data;

        const edgesRes = await fetch("/edges.csv");
        const edgesText = await edgesRes.text();
        const edges = Papa.parse(edgesText, { header: true }).data;

        const nodes = users
          .filter(u => u.user_id)
          .map(u => ({
            id: u.user_id.trim(),
            name: u.user_id.trim(),
            style: {
              fillColor: u.flagged === "1" ? "#FF4136" : "#0074D9",
              radius: u.flagged === "1" ? 30 : 20
            }
          }));

        const links = edges
          .filter(e => e.source && e.target)
          .map((e, i) => ({
            id: `e${i}`,
            from: e.source.trim(),
            to: e.target.trim()
          }));

        setChartData({ nodes, links });
      } catch (err) {
        console.error("Error loading CSVs:", err);
      }
    }

    loadData();
  }, []);

  return (
    <div style={{ width: "100%", height: "500px" }}>
      {chartData.nodes.length > 0 && (
        <NetChart
          config={{
            container: document.getElementById("network-chart"),
            area: { height: 500 },
            data: chartData,
            node: { label: { field: "name" } },
            link: { arrows: true },
            interaction: { zooming: true, rotating: true, dragging: true },
            layout: { type: "force" },
          }}
          id="network-chart"
        />
      )}
    </div>
  );
}

export default NetworkGraph;
