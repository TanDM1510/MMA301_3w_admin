import { BrowserRouter, Route, Routes } from "react-router-dom";
import StaffUser from "./pages/ShareLayoutStaff/StaffUser";
import ShareLayout from "./pages/ShareLayoutStaff/ShareLayout";
import LoginForm from "./pages/Login/Login";
import Forbidden from "./pages/Forbidden/Forbidden";
import NotFound from "./pages/404page/404page";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/staff" element={<ShareLayout />}>
            <Route path="/staff/manageHosts" element={<StaffUser />} />
          </Route>
          <Route path="/" element={<LoginForm />} />
          <Route path="/forbidden" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
