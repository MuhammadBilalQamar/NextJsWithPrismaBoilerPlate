import React, { useState } from 'react';
interface MultiTagInputProps {
    tags: string[];
    // eslint-disable-next-line no-unused-vars
    onChange: (tags: string[]) => void;
}

const MultiTagInput: React.FC<MultiTagInputProps> = ({ tags, onChange }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue.trim() !== '') {
            const newTags = [...tags, inputValue.trim()];
            onChange(newTags);
            setInputValue('');
        }
    };

    const removeTag = (tag: string) => {
        const newTags = tags.filter((t) => t !== tag);
        onChange(newTags);
    };

    return (
        <div>
            <div>
                {tags.map((tag) => (
                    <span key={tag}>
                        {tag}
                        <button onClick={() => removeTag(tag)}>x</button>
                    </span>
                ))}
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
            />
        </div>
    );
};

export default MultiTagInput;
