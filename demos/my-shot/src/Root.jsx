import { Outlet } from 'react-router-dom';
import MainNavbar from "./components/navbar/MainNavbar.jsx";

export default function Root() {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <MainNavbar title="Embeddings w/ Jackie" />
      <div className="main overflow-y-auto p-3">
        <Outlet />
      </div>
    </div>
  );
}
