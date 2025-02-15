import Header from "../components/Header"
import MapView from "../components/MapView"
import Sidebar from "../components/Sidebar"

import "./Planning.css"

function Planning() {
    return (
        <div className="app">
            <div className="header">
                <Header />
            </div>
            <div className="content">
                <div className="sidebar2">
                    <Sidebar />
                </div>
                <div className="map-view">
                    <MapView />
                </div>
            </div>
        </div>
    )
}

export default Planning
