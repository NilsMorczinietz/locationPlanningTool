import { useState } from "react";

import Header from "../components/Header"
import MapView from "../components/MapView"
import Sidebar from "../components/Sidebar"

import "./Planning.css"

export type IsochroneState = "loading" | "neutral" | "initial"

function Planning() {
    const [isochroneRefresh, setIsochroneRefresh] = useState<IsochroneState>("initial");

    const handleIsochroneRefresh = (value : IsochroneState) => {
        setIsochroneRefresh(value);
    };

    return (
        <div className="app">
            <div className="header">
                <Header setIsochroneRefresh={handleIsochroneRefresh} isochroneRefresh={isochroneRefresh}/>
            </div>
            <div className="content">
                <div className="sidebar2">
                    <Sidebar />
                </div>
                <div className="map-view">
                    <MapView isochroneRefresh={isochroneRefresh} setIsochroneRefresh={setIsochroneRefresh}/>
                </div>
            </div>
        </div>
    )
}

export default Planning
