import { BrowserRouter, Route, Routes } from "react-router-dom";
import StaffUser from "./pages/StaffUser";
import ShareLayout from "./pages/ShareLayout";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/staff" element={<ShareLayout />}>
            <Route path="/staff/managerUser" element={<StaffUser />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
