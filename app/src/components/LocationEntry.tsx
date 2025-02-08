import { useState } from 'react';
import './LocationEntry.css';
import { Checkbox } from '@mantine/core';
import { HiDotsVertical } from "react-icons/hi";
import { TextInput } from '@mantine/core';
import { Button } from '@mantine/core';
import { Input } from '@mantine/core';

export default function LocationEntry() {

    const [title, setTitle] = useState<string>('Leitstelle der Feuerwehr');
    const [identifier, setIdentifier] = useState<string>('Kurzbez.: LST');
    const [number, setNumber] = useState<string>('Nr.: L');
    const [address, setAddress] = useState<string>('Hüttenstraße 68');

    const [isEditing, setIsEditing] = useState<boolean>(false);

    return (
        <>
            <div className="locationEntry-content">
                {isEditing ? (
                    <div style={{display:"flex", flexDirection:"column"}}>
                        <div className="locationEntry-info">
                            <div>
                                <Checkbox
                                    defaultChecked={true}
                                    color="red"
                                />
                            </div>
                            <div style={{display:"flex", width:"100%"}}>
                                <Input
                                    placeholder='Titel'
                                    value={title}
                                    onChange={(event) => setTitle(event.currentTarget.value)}
                                />
                            </div>
                            <div></div>

                            <div></div>
                            <div>
                                <TextInput
                                    placeholder='Kurzbezeichnung'
                                    value={identifier}
                                    onChange={(event) => setIdentifier(event.currentTarget.value)}
                                />
                            </div>
                            <div>
                                <TextInput
                                    placeholder='Kennnummer'
                                    value={number}
                                    onChange={(event) => setNumber(event.currentTarget.value)}
                                />
                            </div>

                            <div></div>
                            <div>
                                <TextInput
                                    placeholder='Addresse'
                                    value={address}
                                    onChange={(event) => setAddress(event.currentTarget.value)}
                                />
                            </div>
                            <div></div>
                        </div>
                        {/* <div style={{display:"flex", justifyContent:"space-between", flexDirection:"row", gap:"10px", padding:"10px"}}>
                            <Button fullWidth color="red">Abbrechen</Button>
                            <Button fullWidth color="green">Speichern</Button>
                        </div> */}
                    </div>
                ) : (
                    <>
                        <div className="locationEntry-info">
                            <div>
                                <Checkbox
                                    defaultChecked={true}
                                    color="red"
                                />
                            </div>
                            <div>{title}</div>
                            <div></div>

                            <div></div>
                            <div> {identifier} </div>
                            <div> {number} </div>

                            <div></div>
                            <div> {address} </div>
                            <div></div>
                        </div>
                    </>
                )}
                <div className="locationEntry-edit" onClick={() => setIsEditing(true)}>
                    <HiDotsVertical size={20} style={{ cursor: "pointer" }} />
                </div>
            </div>
        </>
    )
}
