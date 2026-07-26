import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { routePaths } from "./routes";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { RegisterPage } from "./pages/RegisterPage";
import { MerchantInfoPage } from "./pages/MerchantInfoPage";
import { MerchantRegisterPage } from "./pages/MerchantRegisterPage";
import { MerchantWaitingPage } from "./pages/MerchantWaitingPage";
import { MerchantDashboardPage } from "./pages/MerchantDashboardPage";
import { MerchantProfilePage } from "./pages/MerchantProfilePage";
import { MerchantReservationsPage } from "./pages/MerchantReservationsPage";
import { MerchantReservationDetailPage } from "./pages/MerchantReservationDetailPage";
import { MerchantAddProductPage } from "./pages/MerchantAddProductPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { FindUsPage } from "./pages/FindUsPage";
import { ChatbotPage } from "./pages/ChatbotPage";

import { AdminGuard } from "./routes/AdminGuard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={routePaths.home} element={<HomePage />} />
          <Route path={routePaths.login} element={<LoginPage />} />
          <Route path={routePaths.register} element={<RegisterPage />} />
          <Route path={routePaths.marketplace} element={<MarketplacePage />} />
          <Route path={routePaths.product} element={<ProductDetailPage />} />

          <Route path="/merchant" element={<MerchantInfoPage />} />
          <Route path={routePaths.merchantInfo} element={<MerchantInfoPage />} />
          <Route path={routePaths.merchantRegister} element={<MerchantRegisterPage />} />
          <Route path={routePaths.merchantWaiting} element={<MerchantWaitingPage />} />
          <Route path={routePaths.merchantDashboard} element={<MerchantDashboardPage />} />
          <Route path={routePaths.merchantProfile} element={<MerchantProfilePage />} />
          <Route path={routePaths.merchantReservations} element={<MerchantReservationsPage />} />
          <Route path={routePaths.merchantReservationDetail} element={<MerchantReservationDetailPage />} />
          <Route path={routePaths.merchantProductAdd} element={<MerchantAddProductPage />} />

          {/* Protected Admin Routes */}
          <Route element={<AdminGuard />}>
            <Route path={routePaths.adminDashboard} element={<AdminDashboardPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Route>

          <Route path={routePaths.findUs} element={<FindUsPage />} />
          <Route path={routePaths.chatbot} element={<ChatbotPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}