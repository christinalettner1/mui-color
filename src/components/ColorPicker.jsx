import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Popover from '@mui/material/Popover';
import { styled } from '@mui/material/styles';

import ColorButton from './ColorButton';
import ColorBox from './ColorBox';
import * as ColorTool from '../helpers/colorTool';
import * as CommonTypes from '../helpers/commonTypes';
import useTranslate from '../helpers/useTranslate';
import uncontrolled from '../helpers/uncontrolled';

const Root = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  width: 'max-content',
});

const StyledColorButton = styled(ColorButton)({
  margin: 6,
});

const getColorText = (color, disablePlainColor) => {
  let text = disablePlainColor ? `color-${color.hex}` : color.name;
  if (text.startsWith('color-')) {
    if (typeof color.raw !== 'string' || !color.raw.startsWith('#')) {
      text = ColorTool.getCssColor(color, 'hex');
    } else {
      text = color.raw;
    }
  } else if (text === 'none') {
    text = color.raw;
  }
  return text;
};

const ColorPicker = ({
  value,
  disableTextfield,
  deferred,
  palette,
  inputFormats,
  openAtStart,
  onChange,
  onOpen,
  doPopup,
  disableAlpha,
  hslGradient,
  hideTextfield,
  disablePlainColor,
}) => {
  const refPicker = useRef(null);
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslate();
  const color = ColorTool.validateColor(value, disableAlpha, t, i18n.language, disablePlainColor);
  const raw = getColorText(color, disablePlainColor);

  useEffect(() => {
    if (openAtStart) {
      setOpen(true);
    }
  }, [openAtStart]);

  const handleClick = () => {
    const b = Boolean(refPicker.current);
    setOpen(b);
    if (onOpen) onOpen(b);
  };

  const handleClose = () => {
    setOpen(false);
    if (onOpen) onOpen(false);
  };

  const handleColorChange = newColor => {
    onChange(newColor);
    if (deferred) {
      handleClose();
    }
  };

  const handleChange = event => {
    onChange(event.target.value);
  };

  let box = (
    <ColorBox
      value={color}
      style={{ position: 'relative' }}
      deferred={deferred}
      palette={palette}
      inputFormats={inputFormats}
      disableAlpha={disableAlpha}
      hslGradient={hslGradient}
      onChange={handleColorChange}
    />
  );

  if (doPopup) {
    box = doPopup(box);
  } else {
    box = (
      <Popover
        id="color-popover"
        open={open}
        anchorEl={refPicker.current}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {box}
      </Popover>
    );
  }

  let textField = null;
  if (!hideTextfield) {
    textField = disableTextfield ? (
      <div role="button" data-testid="colorpicker-noinput" onClick={handleClick}>
        {color.raw}
      </div>
    ) : (
      <TextField color="primary" value={raw} onChange={handleChange} data-testid="colorpicker-input" />
    );
  }

  return (
    <Root ref={refPicker}>
      <StyledColorButton
        data-testid="colorpicker-button"
        className="muicc-colorpicker-button"
        color={color}
        onClick={handleClick}
      />
      {textField}
      {box}
    </Root>
  );
};

ColorPicker.propTypes = {
  value: CommonTypes.color,
  disableTextfield: PropTypes.bool,
  deferred: PropTypes.bool,
  palette: CommonTypes.palette,
  inputFormats: CommonTypes.inputFormats,
  onChange: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  openAtStart: PropTypes.bool,
  doPopup: PropTypes.func,
  disableAlpha: PropTypes.bool,
  hslGradient: PropTypes.bool,
  hideTextfield: PropTypes.bool,
  disablePlainColor: PropTypes.bool,
};

ColorPicker.defaultProps = {
  value: 'none',
  disableTextfield: false,
  deferred: false,
  palette: undefined,
  inputFormats: ['hex', 'rgb'],
  onOpen: undefined,
  openAtStart: false,
  doPopup: undefined,
  disableAlpha: false,
  hslGradient: false,
  hideTextfield: false,
  disablePlainColor: false,
};

export default uncontrolled(ColorPicker);
