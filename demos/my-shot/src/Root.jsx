import { Outlet } from 'react-router-dom';
import MainNavbar from "./components/navbar/MainNavbar.jsx";
import Footer from "./components/footer/Footer.jsx";

export default function Root() {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <MainNavbar title="Embeddings w/ Jackie" />
      <div className="main overflow-y-auto">
        <div className="min-h-full flex flex-col">
          <div className="flex-grow p-3">
            <Outlet />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
