import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Text } from '@mantine/core';

import { MdDelete } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { setLocations } from '../../redux/slices/mapSlice';

export default function DeleteModal() {
    const dispatch = useDispatch();
    const [opened, { open, close }] = useDisclosure(false);

    function resetLocations() {
        dispatch(setLocations([]));
    }

    return (
        <>
            <Modal
                opened={opened}
                onClose={close}
                title="Bist du sicher?"
                overlayProps={{
                    backgroundOpacity: 0.55,
                    blur: 3,
                }}
            >
                <Text>Willst du dieses Profil wirklich dauerhaft löschen? Diese Aktion kann nicht rückgängig gemacht werden.</Text>

                <div style={{ display: "flex", justifyContent: "center", marginTop: "16px", width: "100%" }}>
                    <Button
                        fullWidth
                        color="red"
                        variant="outline"
                        onClick={close}
                        style={{ marginRight: "8px" }}
                    >
                        Abbrechen
                    </Button>
                    <Button
                        fullWidth
                        color="red"
                        rightSection={<MdDelete size={16} />}
                        onClick={() => {
                            resetLocations();
                            close();
                        }}
                    >
                        Löschen
                    </Button>
                </div>
            </Modal>

            <Button
                variant="light"
                color="rgb(255, 255, 255)"
                rightSection={<MdDelete size={16} />}
                style={{ marginRight: "0px" }}
                onClick={open}
            >
                Löschen
            </Button>
        </>
    );
}