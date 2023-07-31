"use client"
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './styles.module.css';

type DynamicRowInputProps = {
    metaFields: MetaFields[];
    // eslint-disable-next-line no-unused-vars
    onChange: (metaFields: any) => void;
}

type MetaFields = {
    id: string;
    key: string;
    value: string;
}

const DynamicRowInput = ({ metaFields, onChange }: DynamicRowInputProps) => {
    const [inputFields, setInputFields] = useState<MetaFields[]>(
        [{
            id: uuidv4(),
            key: '',
            value: ''
        }]
    );

    useEffect(() => {
        if (metaFields) {
            setInputFields(metaFields)
        }
        else {
            setInputFields([{ id: uuidv4(), key: '', value: '' }])
        }
    }, [])

    const handleChangeInput = (id: any, event: any) => {
        event.preventDefault();

        let newInputFields;
        newInputFields = inputFields.map(i => {
            if (id === i.id) {
                //@ts-ignore
                i[event?.target?.name] = event.target.value
            }
            return i;
        })
        setInputFields(newInputFields);
        onChange(newInputFields);
    }

    const handleAddFields = async (event: any) => {
        event.preventDefault();
        onChange(inputFields);
        setInputFields([...inputFields, { id: uuidv4(), key: '', value: '' }])
    }

    const handleRemoveFields = (id: string, event: any) => {
        event.preventDefault();
        const values = [...inputFields];
        values.splice(values.findIndex(value => value.id === id), 1);
        onChange(values);
        setInputFields(values);
    }

    return (
        <div className={styles.container}>
            <table className={styles._table}>
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                        <th style={{ width: '50px' }}>
                            <div className={styles.action_container}>
                                <button
                                    className={styles.success}
                                    onClick={handleAddFields}
                                >
                                    Add
                                </button>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody id="table_body">
                    {inputFields.map((inputField, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="text"
                                    onChange={(e: any) => handleChangeInput(inputField.id, e)}
                                    className={styles.form_control}
                                    placeholder="Enter key here..."
                                    name='key'
                                    value={inputField.key}
                                />
                            </td>
                            <td>
                                <input
                                    type="text"
                                    onChange={(e: any) => handleChangeInput(inputField.id, e)}
                                    className={styles.form_control}
                                    placeholder="Enter value here..."
                                    name='value'
                                    value={inputField.value}
                                />
                            </td>
                            <td>
                                <div className={styles.action_container}>
                                    <button
                                        className={styles.danger}
                                        onClick={(e: any) => handleRemoveFields(inputField.id, e)}
                                    >
                                        close
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DynamicRowInput;