import { BrowserRouter, Route, Routes } from "react-router-dom";
import StaffUser from "./pages/ShareLayoutStaff/StaffUser";
import ShareLayout from "./pages/ShareLayoutStaff/ShareLayout";
import LoginForm from "./pages/Login/Login";
import Forbidden from "./pages/Forbidden/Forbidden";
import NotFound from "./pages/404page/404page";
import ManageVoucher from "./pages/ShareLayoutStaff/ManageVoucher";
import VourcherDetail from "./pages/ShareLayoutStaff/VourcherDetail";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/staff" element={<ShareLayout />}>
            <Route path="/staff/manageHosts" element={<StaffUser />} />
            <Route path="/staff/manageVouchers" element={<ManageVoucher />} />
            <Route
              path="/staff/manageVouchers/:id"
              element={<VourcherDetail />}
            />
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
