import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Thanks from "./Thanks";
import StripeContainer from "./components/StripeContainer";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/thanks" element={<Thanks />} />
          <Route path="/paymentPage" element={<StripeContainer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
