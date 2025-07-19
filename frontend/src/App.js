import React, { useEffect } from "react";

function App() {
  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Backend message:", data.message);
      })
      .catch((err) => {
        console.error("Error connecting to backend:", err);
      });
  }, []);

  return (
    <div>
      <h1 className="text-7xl text-center">Hello World</h1>
      <p className="text-center text-lg mt-4 text-gray-600">
        Open the browser console to verify backend connection.
      </p>
    </div>
  );
}

export default App;
