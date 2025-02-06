import './LocationEntry.css';
import { Checkbox } from '@mantine/core';

export default function LocationEntry() {
    return (
        <>
            <div className="locationEntry-content">
                <div className="locationEntry-title">Standort 1</div>
                <div className="locationEntry-prefix">Prefix</div>
                <div className="locationEntry-address">Musterstraße 1, 12345 Musterstadt</div>
            </div>
        </>
    )
}
