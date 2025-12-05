import "./HomePage.css";
import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import CategoryBar from "../../components/CategoryBar/CategoryBar.jsx";
import MainContent from "./MainContent.jsx";
import { ListingProvider } from "../../../modules/listings/contexts/ListingsContext.jsx";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  
  const [actualContent, setActualContent] = useState('listingsPage');

  return (
    <div className="w-full min-h-screen bg-white">
      <ListingProvider>

        <Navbar />

        <CategoryBar />

        <MainContent activeContent={actualContent}/>
        
        {/* Internal Routes */}
        <Outlet/>
      
      </ListingProvider>

      {/* Footer Spacing */}
      <div className="h-16"></div>
    </div>
  );
};

export default HomePage;
