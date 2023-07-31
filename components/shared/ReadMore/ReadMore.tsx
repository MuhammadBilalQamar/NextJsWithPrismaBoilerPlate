"use client"
import React, { useState } from 'react';

type ReadMoreProps = {
  text: string;
  maxLength: number;
  buttonStyles?: React.CSSProperties;
};

const ReadMore: React.FC<ReadMoreProps> = ({ text, maxLength, buttonStyles }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const displayText = expanded ? text : text.slice(0, maxLength);

  return (
    <div>
      <p>{displayText + (expanded ? '' : '...')}</p>
      {text.length > maxLength && (
        <button
          onClick={toggleExpanded}
          className="talent-color"
          style={buttonStyles}
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};

export default ReadMore;
