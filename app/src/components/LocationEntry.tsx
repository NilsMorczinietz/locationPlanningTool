import { useEffect, useState } from 'react';

import { HiDotsVertical } from "react-icons/hi";
import { MdDelete } from "react-icons/md";

import { TextInput } from '@mantine/core';
import { Button } from '@mantine/core';
import { Checkbox } from '@mantine/core';
import { Text } from '@mantine/core';

import { useDispatch } from "react-redux";
import { updateLocation, deleteLocation, toggleIsochronesValid } from "../redux/slices/mapSlice";

import { LocationRecord } from "../types";

import './LocationEntry.css';
import { fetchCoordinates } from '../utils/geocodeUtils';
import { mapboxToken } from '../utils/mapUtils';

function LocationView({ locationRecord, toggleActive, onEdit }: { locationRecord: LocationRecord, toggleActive: any, onEdit: any }) {
    return (
        <div className="locationEntry-static">
            <div className="locationEntry-info">
                <Checkbox
                    color="#ff0000"
                    checked={locationRecord.location.active}
                    onChange={toggleActive}
                />
                <Text fw={700}>{locationRecord.location.title}</Text>
                <div />

                <div />
                <Text c="dimmed"> Kurzbez.: {locationRecord.location.identifier} </Text>
                <Text c="dimmed"> Nr.: {locationRecord.location.number} </Text>

                <div />
                <Text c="dimmed"> {locationRecord.location.address} </Text>
                <div />
            </div>
            <div className="locationEntry-edit" onClick={onEdit}>
                <HiDotsVertical size={20} style={{ cursor: "pointer" }} />
            </div>
            {locationRecord.metaData.needsIsochroneRecalculation &&
                <div style={{ display: "flex", height: "100%", width: "8px", backgroundColor: "rgb(255, 0, 0)" }}>
                </div>
            }
        </div>
    );
}

export function LocationForm({ locationRecord, error, setLocation, onCancel, onSave, onDelete }: { locationRecord: LocationRecord, error: any, setLocation: any, onCancel: any, onSave: any, onDelete: any }) {
    return (
        <div className="locationEntry-editing">
            <div className="locationEntry-info-editing">

                <div />
                <TextInput
                    label="Titel"
                    error={error.title}
                    radius="xs"
                    variant="default"
                    placeholder="Titel"
                    value={locationRecord.location.title}
                    onChange={(e) => setLocation((prev: any) => ({ ...prev, location: { ...prev.location, title: e.target.value } }))}
                />
                <div />

                <div />
                <TextInput
                    label="Kurzbezeichnung"
                    error={error.identifier}
                    radius="xs"
                    variant="default"
                    placeholder="Kurzbezeichnung"
                    value={locationRecord.location.identifier}
                    onChange={(e) => setLocation((prev: any) => ({ ...prev, location: { ...prev.location, identifier: e.target.value } }))}
                />
                <TextInput
                    label="Kennnummer"
                    error={error.number}
                    radius="xs"
                    variant="default"
                    placeholder="Kennnummer"
                    value={locationRecord.location.number}
                    onChange={(e) => setLocation((prev: any) => ({ ...prev, location: { ...prev.location, number: e.target.value } }))}
                />


                <div />
                <TextInput
                    label="Adresse"
                    error={error.address}
                    radius="xs"
                    variant="default"
                    placeholder="Adresse"
                    value={locationRecord.location.address}
                    onChange={(e) => setLocation((prev: any) => ({ ...prev, location: { ...prev.location, address: e.target.value } }))}
                />
                <div />
            </div>
            <div className="locationEntry-actions">
                <Button radius="xs" variant="default" color="red" onClick={onCancel}>Abbrechen</Button>
                <Button radius="xs" color="green" onClick={onSave}>Speichern</Button>
                <MdDelete className="delete-icon" color="grey" size={23} onClick={onDelete} style={{ cursor: "pointer" }} />
            </div>
        </div>
    );
}

export default function LocationEntry({ locationRecord }: { locationRecord: LocationRecord }) {
    const dispatch = useDispatch();

    const [error, setError] = useState({
        title: '',
        identifier: '',
        number: '',
        address: '',
    });

    const [editLocation, setEditLocation] = useState<LocationRecord>(locationRecord);
    useEffect(() => {
        setEditLocation(locationRecord);
    }, [locationRecord]);
    

    const [isEditing, setIsEditing] = useState<boolean>(false);

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
        if (!editLocation.location.title) {
            setError((prev: any) => ({ ...prev, title: 'Titel darf nicht leer sein' }));
            valid = false;
        }
        if (!editLocation.location.identifier) {
            setError((prev: any) => ({ ...prev, identifier: 'Kurzbezeichnung darf nicht leer sein' }));
            valid = false;
        }
        if (!editLocation.location.number) {
            setError((prev: any) => ({ ...prev, number: 'Kennnummer darf nicht leer sein' }));
            valid = false;
        }
        if (!editLocation.location.address) {
            setError((prev: any) => ({ ...prev, address: 'Adresse darf nicht leer sein' }));
            valid = false;
        }
        return valid
    }

    async function handleSave() {
        resetError();
        if (!verifyLocation()) return;

        if (editLocation.location.address != locationRecord.location.address) {
            const coordinates = await fetchCoordinates(editLocation.location.address, mapboxToken);
            if (!coordinates) {
                setError((prev: any) => ({ ...prev, address: 'Adresse konnte nicht gefunden werden' }));
                return;
            }

            editLocation.location.coordinates = coordinates;
        }
        if (editLocation.location.coordinates != locationRecord.location.coordinates) {
            editLocation.metaData.needsIsochroneRecalculation = true;
            dispatch(toggleIsochronesValid(false));
        }
        // if (editLocation.identifier != location.identifier) {
        //     editLocation.modifiedFields.identifier = true;
        // }

        dispatch(updateLocation({ ...editLocation }));

        setIsEditing(false);
    }

    function handleCancel() {
        resetError();
        setEditLocation(locationRecord);
        setIsEditing(false);
    }

    function handleDelete() {
        dispatch(deleteLocation(locationRecord.location.id));
    }

    function handleToggleActive() {
        dispatch(updateLocation({ 
            ...locationRecord, 
            location: { 
                ...locationRecord.location, 
                active: !locationRecord.location.active 
            } 
        }));
    }

    return (
        <div className="locationEntry">
            {isEditing ? (
                <LocationForm
                    error={error}
                    locationRecord={editLocation}
                    setLocation={setEditLocation}
                    onCancel={() => handleCancel()}
                    onSave={() => handleSave()}
                    onDelete={() => handleDelete()}
                />
            ) : (
                <LocationView locationRecord={locationRecord} toggleActive={handleToggleActive} onEdit={() => setIsEditing(true)} />
            )}
        </div>
    )
}
