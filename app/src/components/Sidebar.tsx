import { Button } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import "./Sidebar.css";
import LocationEntry from "./LocationEntry";
import CategoryEntry from "./CategoryEntry";

export default function Sidebar() {
    // Locations aus Redux holen
    const locations = useSelector((state: RootState) => state.planning.locations);

    return (
        <div className="sidebar-container">
            <div className="location-list">
                <CategoryEntry />
                {locations.map((location) => (
                    <LocationEntry key={location.id} location={location} />
                ))}
            </div>
            <div className="create-location-button">
                <Button variant="filled" color="rgb(19, 19, 19)" radius="xs">
                    Neuen Standort hinzufügen
                </Button>
            </div>
        </div>
    );
}
