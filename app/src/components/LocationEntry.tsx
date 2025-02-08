import { useState } from 'react';

import { HiDotsVertical } from "react-icons/hi";
import { MdDelete } from "react-icons/md";

import { TextInput } from '@mantine/core';
import { Button } from '@mantine/core';
import { Checkbox } from '@mantine/core';
import { Text } from '@mantine/core';

import { useDispatch } from "react-redux";
import { updateLocation, deleteLocation } from "../redux/actions/locationsActions";

import './LocationEntry.css';

function LocationView({ location, onEdit }: any) {
    return (
        <div className="locationEntry-static">
            <div className="locationEntry-info">
                <Checkbox defaultChecked color="red" />
                <Text fw={700}>{location.title}</Text>
                <div />

                <div />
                <Text c="dimmed"> Kurzbez.: {location.identifier} </Text>
                <Text c="dimmed"> Nr.: {location.number} </Text>

                <div />
                <Text c="dimmed"> {location.address} </Text>
                <div />
            </div>
            <div className="locationEntry-edit" onClick={onEdit}>
                <HiDotsVertical size={20} style={{ cursor: "pointer" }} />
            </div>
        </div>
    );
}

export function LocationForm({ location, error, setLocation, onCancel, onSave, onDelete }: any) {
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
                    value={location.title}
                    onChange={(e) => setLocation((prev: any) => ({ ...prev, title: e.target.value }))}
                />
                <div />

                <div />
                <TextInput
                    label="Kurzbezeichnung"
                    error={error.identifier}
                    radius="xs"
                    variant="default"
                    placeholder="Kurzbezeichnung"
                    value={location.identifier}
                    onChange={(e) => setLocation((prev: any) => ({ ...prev, identifier: e.target.value }))}
                />
                <TextInput
                    label="Kennnummer"
                    error={error.number}
                    radius="xs"
                    variant="default"
                    placeholder="Kennnummer"
                    value={location.number}
                    onChange={(e) => setLocation((prev: any) => ({ ...prev, number: e.target.value }))}
                />


                <div />
                <TextInput
                    label="Adresse"
                    error={error.address}
                    radius="xs"
                    variant="default"
                    placeholder="Adresse"
                    value={location.address}
                    onChange={(e) => setLocation((prev: any) => ({ ...prev, address: e.target.value }))}
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

interface Location {
    id: string;
    title: string;
    identifier: string;
    number: string;
    address: string;
}

interface LocationEntryProps {
    location: Location;
}

export default function LocationEntry({ location }: LocationEntryProps) {

    const dispatch = useDispatch();

    const [error, setError] = useState({
        title: '',
        identifier: '',
        number: '',
        address: '',
    });

    const [editLocation, setEditLocation] = useState({ ...location });

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
        if (!editLocation.title) {
            setError((prev: any) => ({ ...prev, title: 'Titel darf nicht leer sein' }));
            valid = false;
        }
        if (!editLocation.identifier) {
            setError((prev: any) => ({ ...prev, identifier: 'Kurzbezeichnung darf nicht leer sein' }));
            valid = false;
        }
        if (!editLocation.number) {
            setError((prev: any) => ({ ...prev, number: 'Kennnummer darf nicht leer sein' }));
            valid = false;
        }
        if (!editLocation.address) {
            setError((prev: any) => ({ ...prev, address: 'Adresse darf nicht leer sein' }));
            valid = false;
        }
        return valid
    }

    function handleSave() {
        resetError();
        if (!verifyLocation()) return;
        dispatch(updateLocation(editLocation));
        setIsEditing(false);
    }

    function handleCancel() {
        resetError();
        setEditLocation(location);
        setIsEditing(false);
    }

    function handleDelete() {
        dispatch(deleteLocation(location.id));
    }

    return (
        <div className="locationEntry">
            {isEditing ? (
                <LocationForm
                    error={error}
                    location={editLocation}
                    setLocation={setEditLocation}
                    onCancel={() => handleCancel()}
                    onSave={() => handleSave()}
                    onDelete={() => handleDelete()}
                />
            ) : (
                <LocationView location={location} onEdit={() => setIsEditing(true)} />
            )}
        </div>
    )
}
