import { BrowserRouter, Route, Routes } from "react-router-dom";
import StaffUser from "./pages/ShareLayoutStaff/StaffUser";
import ShareLayout from "./pages/ShareLayoutStaff/ShareLayout";
import ShareLayoutAdmin from "./pages/ShareLayoutAdmin/ShareLayout";
import AdminAccount from "./pages/ShareLayoutAdmin/AdminAccount";
import AdminPayment from "./pages/ShareLayoutAdmin/AdminPayment";
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
          <Route path="/admin" element={<ShareLayoutAdmin />}>
            <Route path="/admin/manageAccount" element={<AdminAccount />} />
            <Route path="/admin/managePayment" element={<AdminPayment />} />
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
