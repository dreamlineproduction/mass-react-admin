import { Toaster } from "react-hot-toast";
import AppContent from "./AppContent";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

const DefaultLayout = () => {
    return (
        <div className="wrapper">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <AppSidebar />
            <div className="main">
                <AppHeader />
                <main className="content">
                    <div className="container-fluid p-0">
                        <AppContent />
                    </div>                
                </main>
                <AppFooter/>
            </div>
        </div>
    );
};

export default DefaultLayout;