import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { Checkbox, FormControlLabel } from '@mui/material';

export default function InputCheckBox({name, InputCheckBoxValue, disabled = true}) {
  const theme = useTheme();
  const [checkBoxValue, setCheckBoxValue] = InputCheckBoxValue;

  const handleChange = (event) => {
    setCheckBoxValue(event.target.checked);
  };

  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            checked={checkBoxValue}
            onChange={handleChange}
            name = {name}
            inputProps={{ 'aria-label': 'controlled' }}
            disabled={disabled}
          />
        }
        label={name}
      />
    </div>
  );
}