"use client"
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

type CustomDropdownProps = {
    label?: string;
    id?: string | 'dropdown-basic';
    options: string[];
    // eslint-disable-next-line no-unused-vars
    onChange: (value: any) => void;
    styles?: any;
}

const CustomDropdown = ({ options, label, styles, id, onChange }: CustomDropdownProps) => {
    const [value, setValue] = useState<string | undefined>(undefined);

    const handleChange = (item: string) => {
        onChange(item)
        setValue(item);
    }

    return (
        <Dropdown>
            <Dropdown.Toggle className='btn btn-secondary dropdown-toggle join-form-dropdown' id={id}
                style={{
                    ...styles,
                    width: '100%',
                }}
            >
                {value || label || 'Please select'}
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdown-menu join-drop-menu">
                {options.map((item, index) => (
                    <Dropdown.Item className="dropdown-item" key={index} onClick={() => handleChange(item)}>{item}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
}

export default CustomDropdown;