import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layouts/MainLayout";
import { routePaths } from "./routes";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { RegisterPage } from "./pages/RegisterPage";
import { MerchantDashboardPage } from "./pages/MerchantDashboardPage";
import { MerchantProfilePage } from "./pages/MerchantProfilePage";
import { MerchantReservationsPage } from "./pages/MerchantReservationsPage";
import { MerchantReservationDetailPage } from "./pages/MerchantReservationDetailPage";
import { MerchantAddProductPage } from "./pages/MerchantAddProductPage";
import { FindUsPage } from "./pages/FindUsPage";
import { ChatbotPage } from "./pages/ChatbotPage";

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

          <Route path={routePaths.merchantDashboard} element={<MerchantDashboardPage />} />
          <Route path={routePaths.merchantProfile} element={<MerchantProfilePage />} />
          <Route path={routePaths.merchantReservations} element={<MerchantReservationsPage />} />
          <Route path={routePaths.merchantReservationDetail} element={<MerchantReservationDetailPage />} />
          <Route path={routePaths.merchantProductAdd} element={<MerchantAddProductPage />} />
          <Route path={routePaths.findUs} element={<FindUsPage />} />
          <Route path={routePaths.chatbot} element={<ChatbotPage />} />
          

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}