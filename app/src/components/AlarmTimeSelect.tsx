import { useState } from 'react';

import { Input, InputBase, Combobox, useCombobox, Text } from '@mantine/core';

import { useDispatch, useSelector } from 'react-redux';
import { setTimeLimit } from '../redux/slices/settingsSlice';

import classes from './alarmTimeSelect.module.css';
import { RootState } from '../redux/store';
import { toggleIsochronesValid } from '../redux/slices/mapSlice';

interface Item {
    label: string;
    value: number;
}

const items: Item[] = [
    { label: "5 Minuten", value: 5 },
    { label: "6 Minuten", value: 6 },
    { label: "7 Minuten", value: 7 },
    { label: "8 Minuten", value: 8 },
    { label: "10 Minuten", value: 10 },
];

export default function AlarmTimeSelect() {
    const dispatch = useDispatch();

    const initAlarmTime = useSelector((state: RootState) => state.settings.timeLimit);
    
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [value, setValue] = useState<number | null>(initAlarmTime);

    const options = items.map((item) => (
        <Combobox.Option value={item.value.toString()} key={item.value}>
            <Text>{item.label}</Text>
        </Combobox.Option>
    ));

    function handleSelect(value: number) {
        setValue(value);
        dispatch(setTimeLimit(value));
        dispatch(toggleIsochronesValid(false));
    }

    return (
        <Combobox
            store={combobox}
            onOptionSubmit={(val) => {
                const selectedItem = items.find((item) => item.value.toString() === val);
                if (selectedItem) {
                    handleSelect(selectedItem.value);
                }
                combobox.closeDropdown();
            }}
        >
            <Combobox.Target>
                <InputBase
                    classNames={{ input: classes.input, section: classes.section, wrapper: classes.wrapper }}
                    component="button"
                    type="button"
                    pointer
                    rightSection={<Combobox.Chevron />}
                    rightSectionPointerEvents="none"
                    onClick={() => combobox.toggleDropdown()}
                >
                    {value !== null ? (
                        <Text>{items.find((item) => item.value === value)?.label}</Text>
                    ) : (
                        <Input.Placeholder>Pick value</Input.Placeholder>
                    )
                    }
                </InputBase>
            </Combobox.Target>

            <Combobox.Dropdown>
                <Combobox.Options>{options}</Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}