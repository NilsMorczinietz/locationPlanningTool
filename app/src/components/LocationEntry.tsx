import { useState } from 'react';
import './LocationEntry.css';
import { Checkbox } from '@mantine/core';
import { HiDotsVertical } from "react-icons/hi";
import { TextInput } from '@mantine/core';
import { Button } from '@mantine/core';
import { Input } from '@mantine/core';
import { MdDelete } from "react-icons/md";

function LocationView({ location, onEdit }: any) {
    return (
        <div className="locationEntry-static">
            <div className="locationEntry-info">
                <Checkbox defaultChecked color="red" />
                <div>{location.title}</div>
                <div />

                <div />
                <div> Kurzbez.: {location.identifier} </div>
                <div> Nr.: {location.number} </div>

                <div />
                <div> {location.address} </div>
                <div />
            </div>
            <div className="locationEntry-edit" onClick={onEdit}>
                <HiDotsVertical size={20} style={{ cursor: "pointer" }} />
            </div>
        </div>
    );
}

function LocationForm({ location, setLocation, onCancel, onSave, onDelete }: any) {
    return (
        <div className="locationEntry-editing">
            <div className="locationEntry-info-editing">

                <div />
                <Input.Wrapper label="Titel" description="" error="">
                    <Input
                        radius="xs"
                        variant="default"
                        placeholder="Titel"
                        value={location.title}
                        onChange={(e) => setLocation((prev: any) => ({ ...prev, title: e.target.value }))}
                    />
                </Input.Wrapper>
                <div />

                <div />
                <Input.Wrapper label="Kurzbezeichnung" description="" error="">
                    <TextInput
                        radius="xs"
                        variant="default"
                        placeholder="Kurzbezeichnung"
                        value={location.identifier}
                        onChange={(e) => setLocation((prev: any) => ({ ...prev, identifier: e.target.value }))}
                    />
                </Input.Wrapper>
                <Input.Wrapper label="Kennnummer" description="" error="">
                    <TextInput
                        radius="xs"
                        variant="default"
                        placeholder="Kennnummer"
                        value={location.number}
                        onChange={(e) => setLocation((prev: any) => ({ ...prev, number: e.target.value }))}
                    />
                </Input.Wrapper>


                <div />
                <Input.Wrapper label="Adresse" description="" error="">
                    <TextInput
                        radius="xs"
                        variant="default"
                        placeholder="Adresse"
                        value={location.address}
                        onChange={(e) => setLocation((prev: any) => ({ ...prev, address: e.target.value }))}
                    />
                </Input.Wrapper>
                <div />
            </div>
            <div className="locationEntry-actions">
                <Button variant="default" color="red" onClick={onCancel}>Abbrechen</Button>
                <Button color="green" onClick={onSave}>Speichern</Button>
                <MdDelete className="delete-icon" color="grey" size={23} />
            </div>
        </div>
    );
}

export default function LocationEntry() {

    const [location, setLocation] = useState({
        title: 'Leitstelle der Feuerwehr',
        identifier: 'LST',
        number: 'L',
        address: 'Hüttenstraße 68',
    });

    const [editLocation, setEditLocation] = useState({
        title: location.title,
        identifier: location.identifier,
        number: location.number,
        address: location.address,
    });

    const [isEditing, setIsEditing] = useState<boolean>(false);

    function handleSave() {
        setLocation(editLocation);
        setIsEditing(false);
    }

    function handleCancel() {
        setEditLocation(location);
        setIsEditing(false);
    }

    function handleDelete() {
        setIsEditing(false);
    }

    return (
        <div className="locationEntry-content">
            {isEditing ? (
                <LocationForm
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
