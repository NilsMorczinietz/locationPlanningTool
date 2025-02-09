import { useState } from "react";

import { Button } from "@mantine/core";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { addLocation } from "../redux/actions/locationsActions";
import { v4 as uuidv4 } from "uuid";

import LocationEntry from "./LocationEntry";
import CategoryEntry from "./CategoryEntry";

import { LocationForm } from "./LocationEntry";
import "./Sidebar.css";
import { LocationsState } from "../redux/reducers/locationsReducer";

export default function Sidebar() {
    const dispatch = useDispatch();
    const locations = useSelector((state: RootState) => state.planning as LocationsState).locations;


    const [newLocation, setNewLocation] = useState<{
        id: string;
        active: boolean;
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

    function createNewLocation() {
        setNewLocation({
            id: "",
            active: true,
            title: "",
            identifier: "",
            number: "",
            address: "",
        });
    }

    function handleSaveNewLocation() {
        resetError();
        if (!verifyLocation()) return;
        if (newLocation) {
            dispatch(addLocation({
                id: uuidv4(),
                active: newLocation.active || true,
                title: newLocation.title || "",
                identifier: newLocation.identifier || "",
                number: newLocation.number || "",
                address: newLocation.address || ""
            }));
        }
        setNewLocation(null);
    }

    return (
        <div className="sidebar-container">
            <div className="location-list">
                <CategoryEntry title={`Feuerwachen Düsseldorf (${locations.length})`}/>
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
                        onSave={() => handleSaveNewLocation()}
                        onDelete={() => cancleCreateLocation()}
                    />
                ) : (
                    <Button variant="filled" color="rgb(19, 19, 19)" radius="xs" onClick={() => createNewLocation()}>
                        Neuen Standort hinzufügen
                    </Button>
                )}
            </div>

        </div>
    );
}
