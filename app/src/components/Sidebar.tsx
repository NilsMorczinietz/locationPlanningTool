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

    const [error, setError] = useState({
        title: '',
        identifier: '',
        number: '',
        address: '',
    });

    function resetError() {
        setError({
            title: '',
            identifier: '',
            number: '',
            address: '',
        });
    }

    function verifyLocation() {
        let valid = true
        if (newLocation && !newLocation.title) {
            setError((prev: any) => ({ ...prev, title: 'Titel darf nicht leer sein' }));
            valid = false;
        }
        if (newLocation && !newLocation.identifier) {
            setError((prev: any) => ({ ...prev, identifier: 'Kurzbezeichnung darf nicht leer sein' }));
            valid = false;
        }
        if (newLocation && !newLocation.number) {
            setError((prev: any) => ({ ...prev, number: 'Kennnummer darf nicht leer sein' }));
            valid = false;
        }
        if (newLocation && !newLocation.address) {
            setError((prev: any) => ({ ...prev, address: 'Adresse darf nicht leer sein' }));
            valid = false;
        }
        return valid
    }

    function cancleCreateLocation() {
        resetError();
        setNewLocation(null);
    }

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
                        error={error}
                        setLocation={setNewLocation}
                        onCancel={() => cancleCreateLocation()}
                        onSave={() => {
                            resetError();
                            if(!verifyLocation()) return;
                            dispatch(addLocation({ ...newLocation, id: uuidv4() }));
                            setNewLocation(null);
                        }}
                        onDelete={() => cancleCreateLocation()}
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
