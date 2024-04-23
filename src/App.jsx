import { BrowserRouter, Route, Routes } from "react-router-dom";
import StaffUser from "./pages/StaffUser";
import ShareLayout from "./pages/ShareLayout";
import LoginForm from "./pages/Login";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/404page";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/staff" element={<ShareLayout />}>
            <Route path="/staff/managerUser" element={<StaffUser />} />
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
