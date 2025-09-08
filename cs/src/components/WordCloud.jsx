import React, { useEffect, useRef, useMemo } from "react";
import WordCloud from "wordcloud";
import { removeStopwords } from "stopword";

function MyWordCloud({ tweets }) {
  const canvasRef = useRef(null);

  const wordList = useMemo(() => {
    if (!tweets || tweets.length === 0) {
      return [
        ["india", 15],
        ["politics", 12],
        ["content", 8],
        ["analysis", 6],
      ];
    }

    // Collect all texts individually with label checks
    const allTexts = [];
    tweets.forEach((t) => {
      if (t.OpenAI_Label_Post === 1 && (t.Post_Title || t.Post_title)) {
        allTexts.push(t.Post_Title || t.Post_title);
      }
      if (t.OpenAI_Label_Comment === 1 && t.Comment_Body) {
        allTexts.push(t.Comment_Body);
      }
    });

    if (allTexts.length === 0) {
      return [
        ["no", 10],
        ["content", 8],
        ["found", 6],
      ];
    }

    // Tokenize each text separately
    const words = allTexts.flatMap((text) =>
      removeStopwords(text.split(/\s+/))
    );

    const frequencyMap = {};
    words.forEach((word) => {
      const clean = word.toLowerCase().replace(/[^a-z0-9]/gi, "");
      if (clean && clean.length >= 5) {
        frequencyMap[clean] = (frequencyMap[clean] || 0) + 1;
      }
    });

    return Object.entries(frequencyMap)
      .map(([text, value]) => [text, value])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50);
  }, [tweets]);

  useEffect(() => {
    if (canvasRef.current && wordList.length) {
      // 🔄 Clear the canvas before re-render
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      WordCloud(canvasRef.current, {
        list: wordList,
        gridSize: 8,
        weightFactor: (size) => 14 + size * 10,
        fontFamily: "Arial, sans-serif",
        color: () =>
          [
            "#1f77b4",
            "#ff7f0e",
            "#2ca02c",
            "#d62728",
            "#9467bd",
            "#8c564b",
            "#e377c2",
            "#7f7f7f",
            "#bcbd22",
            "#17becf",
          ][Math.floor(Math.random() * 10)],
        rotateRatio: 0,
        backgroundColor: "transparent",
        drawOutOfBound: false,
        click: (item) => console.log(`Clicked: ${item[0]} (${item[1]})`),
      });
    }
  }, [ tweets]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      style={{ width: "100%", height: "500px" }}
    />
  );
}

export default MyWordCloud;
