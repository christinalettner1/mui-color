import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import ColorButton from './ColorButton';
import * as CommonTypes from '../helpers/commonTypes';
import useTranslate from '../helpers/useTranslate';

const Root = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  padding: '8px 0 0 8px',
});

const PaletteButton = styled(ColorButton)({
  margin: '0 8px 8px 0',
  padding: 0,
});

const ColorPalette = ({ size, borderWidth, palette, onSelect, disableAlpha }) => {
  const { t } = useTranslate();

  const handleSelectColor = name => {
    const translatedName = t(name);
    if (onSelect) onSelect(translatedName, palette[name]);
  };

  return (
    <Root>
      {Object.keys(palette).map(name => (
        <PaletteButton
          size={size}
          key={`${name}`}
          color={palette[name]}
          className="muicc-palette-button"
          borderWidth={borderWidth}
          tooltip={name}
          disableAlpha={disableAlpha}
          onClick={() => handleSelectColor(name)}
        />
      ))}
    </Root>
  );
};

ColorPalette.propTypes = {
  borderWidth: PropTypes.number,
  size: PropTypes.number,
  palette: CommonTypes.palette.isRequired,
  forwardRef: PropTypes.shape({ current: PropTypes.elementType }),
  onSelect: PropTypes.func,
  disableAlpha: PropTypes.bool,
};

ColorPalette.defaultProps = {
  borderWidth: 0,
  size: 24,
  forwardRef: undefined,
  onSelect: undefined,
  disableAlpha: false,
};

export default ColorPalette;
