import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';
import * as ColorTool from '../helpers/colorTool';
import uncontrolled from '../helpers/uncontrolled';
import * as CommonTypes from '../helpers/commonTypes';
import useTranslate from '../helpers/useTranslate';

const Root = styled('div')({
  display: 'flex',
  flexDirection: 'row',
});

const RawControl = styled(FormControl)({
  paddingRight: 4,
});

const StyledFormControl = styled(FormControl)({
  width: 100,
});

const ColorInput = ({
  value,
  format,
  onChange,
  disableAlpha,
  enableErrorDisplay,
  forwardRef,
  disablePlainColor,
  ...props
}) => {
  const { t, i18n } = useTranslate();
  const color = ColorTool.validateColor(value, disableAlpha, t, i18n.language, disablePlainColor);
  let field;
  let components;

  const handleFieldChange = event => {
    if (format === 'plain') {
      onChange(event.target.value);
    } else if (format === 'hex') {
      onChange(`#${event.target.value}`);
    } else {
      const cn = event.target.id;
      const v = Number(event.target.value);
      const values = {};
      Object.keys(components).forEach(e => {
        let cv = components[e].value;
        if (e === cn) {
          cv = v;
          if (cv < components[e].min) cv = components[e].min;
          if (cv > components[e].max) cv = components[e].max;
        }
        values[e] = cv;
      });
      onChange(values);
    }
  };

  const buildInput = (cn, name, v, unit, isStart) => (
    <>
      <InputLabel htmlFor={cn} className="muicc-colorinput-label" data-testid="colorinput-label">
        {name}
      </InputLabel>
      <Input
        id={cn}
        name={cn}
        className="muicc-colorinput-input"
        label={name}
        value={v}
        placeholder={name}
        inputProps={{ 'aria-label': `color-${name}`, 'data-testid': 'colorinput-input' }}
        onChange={handleFieldChange}
        startAdornment={isStart && unit && <InputAdornment position="start">{unit}</InputAdornment>}
        {...props}
      />
    </>
  );

  if (format === 'plain') {
    field = buildInput('color-plain', 'Color', color.raw);
  } else {
    components = ColorTool.getComponents(color, format, disableAlpha, t);
    const names = Object.keys(components);
    field = (
      <Root ref={forwardRef}>
        {names.map(cn => (
          <RawControl key={cn} className="muicc-colorinput-raw" error={!!color.error}>
            {buildInput(cn, components[cn].name, components[cn].value, components[cn].unit, names.length === 1)}
          </RawControl>
        ))}
      </Root>
    );
  }

  return (
    <StyledFormControl error={!!color.error} data-testid="colorinput">
      {field}
      {enableErrorDisplay && color.error && <FormHelperText id="component-error-text">{color.error}</FormHelperText>}
    </StyledFormControl>
  );
};

ColorInput.propTypes = {
  value: CommonTypes.color,
  format: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disableAlpha: PropTypes.bool,
  enableErrorDisplay: PropTypes.bool,
  forwardRef: PropTypes.shape({ current: PropTypes.elementType }),
  disablePlainColor: PropTypes.bool,
};

ColorInput.defaultProps = {
  value: 'none',
  format: 'plain',
  forwardRef: undefined,
  disableAlpha: false,
  enableErrorDisplay: true,
  disablePlainColor: false,
};

export default uncontrolled(ColorInput);