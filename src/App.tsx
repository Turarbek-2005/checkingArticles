import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checking from "@/components/Checking";
import Auth from "@/components/Auth";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Checking />} />
        <Route path="/Auth" element={<Auth />} />
      </Routes>
    </Router>
  );
};

export default App;
