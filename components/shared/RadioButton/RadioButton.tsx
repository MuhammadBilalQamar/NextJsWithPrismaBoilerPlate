"use client"
import { useState } from 'react';
import Form from 'react-bootstrap/Form';

type CustomRadioButtonsProps = {
    options: string[];
    id?: string | '';
    value?: string;
    className?: string | '';
    // eslint-disable-next-line no-unused-vars
    onChange: (value: any) => void;
}

const CustomRadioButtons = ({ options, className, onChange, id }: CustomRadioButtonsProps) => {
    const [valueState, setValueState] = useState('');

    const handleChange = (value: any) => {
        setValueState(value);
        onChange(value);
    };

    return (
        <div id={id}>
            {options.map((item, index) => (
                <Form.Check
                    className={className}
                    checked={valueState === item}
                    inline
                    label={item}
                    name="group1"
                    type="radio"
                    id={`inline-radio-${index}-${id}`}
                    key={Math.random()}
                    onClick={() => { handleChange(item) }}
                    onChange={() => { handleChange(item) }}
                />
            ))}
        </div>
    );
}

export default CustomRadioButtons;