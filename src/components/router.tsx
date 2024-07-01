import { AuthProvider, RequireAuth } from "../contexts/authContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Welcome from "./welcom";
import { DroneFeed } from "../pages/home";
import NotFound from "../pages/404";
import { Display } from "../utils/device";

export default function AllRoutes() {
  const { isDesktop } = Display()
  return (
    <AuthProvider>
    <BrowserRouter basename="/">
    <Routes>
      <Route path="/" element={<Welcome />} />
      {/* @ts-ignore */}
      <Route path='/home/*' element={<RequireAuth><DroneFeed /></RequireAuth>} />
      {/* 404 page */}
      <Route path="*" element={<NotFound isDesktop={isDesktop} />} />
    </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}