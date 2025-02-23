import { useState } from "react";

import { Button } from "@mantine/core";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useDispatch } from "react-redux";

import { v4 as uuidv4 } from "uuid";

import LocationEntry from "./LocationEntry";
import CategoryEntry from "./CategoryEntry";

import { LocationForm } from "./LocationEntry";
import { addLocation, toggleIsochronesValid } from "../redux/slices/mapSlice";


import "./Sidebar.css";
import { fetchCoordinates } from "../utils/geocodeUtils";
import { mapboxToken } from "../utils/mapUtils";
import { LocationRecord } from "../types";

export default function Sidebar() {
    const dispatch = useDispatch();
    const locations = useSelector((state: RootState) => state.map.locations)

    const initialLocationState: LocationRecord = {
        location: {
            id: uuidv4(),
            active: true,
            title: "",
            identifier: "",
            number: "",
            address: "",
            coordinates: [0, 0],
        },
        metaData: {
            needsIsochroneRecalculation: true,
        },
    };
    const initialErrorState = {
        title: '',
        identifier: '',
        number: '',
        address: '',
    };


    const [newLocationRecord, setNewLocationRecord] = useState<LocationRecord | null>(null);
    const [error, setError] = useState(initialErrorState);

    function resetError() {
        setError(initialErrorState);
    }
    function resetLocation() {
        setNewLocationRecord(null);
    }


    function verifyLocation() {
        let valid = true

        if (!newLocationRecord) return false;

        if (!newLocationRecord.location.title) {
            setError((prev: any) => ({ ...prev, title: 'Titel darf nicht leer sein' }));
            valid = false;
        }
        if (!newLocationRecord.location.identifier) {
            setError((prev: any) => ({ ...prev, identifier: 'Kurzbezeichnung darf nicht leer sein' }));
            valid = false;
        }
        if (!newLocationRecord.location.number) {
            setError((prev: any) => ({ ...prev, number: 'Kennnummer darf nicht leer sein' }));
            valid = false;
        }
        if (!newLocationRecord.location.address) {
            setError((prev: any) => ({ ...prev, address: 'Adresse darf nicht leer sein' }));
            valid = false;
        }

        return valid
    }

    function cancleCreateLocation() {
        resetError();
        resetLocation();
    }

    function createNewLocation() {
        setNewLocationRecord(initialLocationState);
    }

    async function handleSaveNewLocation() {
        resetError();

        if (!newLocationRecord || !verifyLocation()) return;

        const coordinates = await fetchCoordinates(newLocationRecord.location.address, mapboxToken);
        newLocationRecord.location.coordinates = coordinates;

        if (newLocationRecord) {
            dispatch(addLocation({ ...newLocationRecord }));
            dispatch(toggleIsochronesValid(false));
        }
        resetLocation();
    }

    return (
        <div className="sidebar-container">
            <div className="location-list">
                <CategoryEntry title={`Feuerwachen Düsseldorf (${locations.length})`} />
                {locations.map((locationRecord) => (
                    <LocationEntry key={locationRecord.location.id} locationRecord={locationRecord} />
                ))}
            </div>
            <div className="create-location-button">
                {newLocationRecord ? (
                    <LocationForm
                        locationRecord={newLocationRecord}
                        error={error}
                        setLocation={setNewLocationRecord}
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
