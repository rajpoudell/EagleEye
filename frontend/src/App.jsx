import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AddCriminals from "./pages/AddCriminals";
import AddIo from "./pages/AddIo";
import Criminals from "./pages/Criminals";
import Dashboard from "./pages/Dashboard";
import IO from "./pages/IO";
import Live_feed from "./pages/Live_feed";
import Login from "./pages/Login";
import Logs from "./pages/Logs";
import Search from "./pages/Search";
import Station from "./pages/Station";
function App() {
  const PrivateRoute = ({ children }) => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    return loggedInUser ? children : <Navigate to="/login" />;
  };
  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/live-feeds" element={<Live_feed />} />
            <Route path="/criminals" element={<Criminals />} />
            <Route path="/add-criminal" element={<AddCriminals />} />
            <Route path="/io" element={<IO />} />
            <Route path="/io/add" element={<AddIo />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login />} />
            <Route path="/station" element={<Station />} />
          </Routes>
        </Layout>
      </Router>
    </>
  );
}

export default App;
