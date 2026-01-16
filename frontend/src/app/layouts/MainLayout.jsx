// external
import { Outlet } from "react-router-dom";

//internal
import { Navbar } from "@/shared/index";

const MainLayout = () => {
    return (
        <div>
            <Navbar />
            <Outlet />
        </div>
    );
}

export default MainLayout;