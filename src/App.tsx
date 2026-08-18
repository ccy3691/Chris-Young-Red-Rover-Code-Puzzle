import { useMemo, useState } from "react";
import { formatInput, FormatType } from "./utils/parser";
import whiteboardImage from "./assets/red_rover_whiteboard.jpg";
import "./App.css";

function App() {
  const [format, setFormat] = useState<FormatType>(FormatType.AsParsed);
  const [input, setInput] = useState("(id, name, email, type(id, name, customFields(c1, c2, c3)), externalId)");

  const { output, error } = useMemo(() => {
    try {
      return { output: formatInput(input, format), error: "" };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : String(e) };
    }
  }, [input, format]);

  return (
    <>
      <h2 className="title">Red Rover Code Puzzle</h2>
      <p className="subtitle">Whiteboard of my planning and thought process. click <a href={whiteboardImage} target="_blank" rel="noopener noreferrer">HERE</a></p>
      <p className="subtitle"><a href="https://github.com/ccy3691/Red-Rover-Code-Puzzle-Chris-Young" target="_blank" rel="noopener noreferrer">GitHub</a></p>
      <div className="format-container">
        <label htmlFor="format">Output Format:</label>
        <select
          id="format"
          value={format}
          onChange={(e) => setFormat(Number(e.target.value))}
        >
          <option value={FormatType.AsParsed}>As parsed</option>
          <option value={FormatType.Alphabetical}>Alphabetical</option>
        </select>
      </div>
      <div className="container">
        <div className="input-container">
          <h2>Input:</h2>
          <textarea
            className="input"
            placeholder="Enter your input string..."
            maxLength={500}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="output-container">
          <h2>Output:</h2>
          <pre className="output">{error ? `Error: ${error}` : output}</pre>
        </div>
      </div>
    </>
  );
}

export default App;
