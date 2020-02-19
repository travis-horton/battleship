import React from 'react';

export default function ConfigSelector({
  id,
  type,
  labelText,
  min,
  max,
  onChange,
}) {
  const handleInput = (e) => {
    onChange(e, id);
  };

  const options = {
    type,
    id,
    min,
    max,
    name: id,
    autoComplete: 'off',
  };

  return (
    <div>
      <label htmlFor={id}>
        { labelText }
      </label>
      <input onChange={handleInput} {...options} />
    </div>
  );
}
