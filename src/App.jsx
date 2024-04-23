import { BrowserRouter, Route, Routes } from "react-router-dom";
import StaffUser from "./pages/StaffUser";
import ShareLayout from "./pages/ShareLayout";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/staff" element={<ShareLayout />}>
            <Route path="/staff/managerUser" element={<StaffUser />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
