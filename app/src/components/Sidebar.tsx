import { useState } from "react";

import { Button } from "@mantine/core";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { addLocation } from "../redux/actions/locationsActions";
import { v4 as uuidv4 } from "uuid"; // Zum Generieren einer eindeutigen ID

import LocationEntry from "./LocationEntry";
import CategoryEntry from "./CategoryEntry";

import { LocationForm } from "./LocationEntry";
import "./Sidebar.css";

export default function Sidebar() {
    const dispatch = useDispatch();
    const locations = useSelector((state: RootState) => state.planning.locations);

    const [newLocation, setNewLocation] = useState<{
        id: string;
        title: string;
        identifier: string;
        number: string;
        address: string;
    } | null>(null);

    return (
        <div className="sidebar-container">
            <div className="location-list">
                <CategoryEntry />
                {locations.map((location) => (
                    <LocationEntry key={location.id} location={location} />
                ))}
            </div>
            <div className="create-location-button">
                {newLocation ? (
                    <LocationForm
                        location={newLocation}
                        error={{ title: "", identifier: "", number: "", address: "" }}
                        setLocation={setNewLocation}
                        onCancel={() => setNewLocation(null)}
                        onSave={() => {
                            if (!newLocation.title || !newLocation.identifier || !newLocation.number || !newLocation.address) {
                                return;
                            }
                            dispatch(addLocation({ ...newLocation, id: uuidv4() }));
                            setNewLocation(null);
                        }}
                        onDelete={() => setNewLocation(null)}
                    />
                ) : (
                    <Button variant="filled" color="rgb(19, 19, 19)" radius="xs" onClick={() => setNewLocation({
                        id: "",
                        title: "",
                        identifier: "",
                        number: "",
                        address: "",
                    })}>
                        Neuen Standort hinzufügen
                    </Button>
                )}
            </div>

        </div>
    );
}
