import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { Suspense } from "react";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Live_feed from "./pages/Live_feed";
import Criminals from "./pages/Criminals";
import AddCriminals from "./pages/AddCriminals";
import IO from "./pages/IO";
import Logs from "./pages/Logs";
import AddIo from "./pages/AddIo";

function App() {
  return (
    <>
      <Router>
        <Layout>
            <Routes>
              {" "}
              <Route path="/" element={<Dashboard />} />
              <Route path="/live-feeds" element={<Live_feed />} />
              <Route path="/criminals" element={<Criminals />} />
              <Route path="/add-criminal" element={<AddCriminals />} />
              <Route path="/io" element={<IO />} />
              <Route path="/io/add" element={<AddIo />} />
              <Route path="/logs" element={<Logs />} />
            </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
