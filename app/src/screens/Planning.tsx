import { useState } from "react";

import Header from "../components/Header"
import MapView from "../components/MapView"
import Sidebar from "../components/Sidebar"

import "./Planning.css"

function Planning() {
    const [isochroneRefresh, setIsochroneRefresh] = useState(false);

    const handleIsochroneRefresh = () => {
        setIsochroneRefresh(prev => !prev);
    };

    return (
        <div className="app">
            <div className="header">
                <Header onIsochroneRefresh={handleIsochroneRefresh}/>
            </div>
            <div className="content">
                <div className="sidebar2">
                    <Sidebar />
                </div>
                <div className="map-view">
                    <MapView isochroneRefresh={isochroneRefresh}/>
                </div>
            </div>
        </div>
    )
}

export default Planning
