import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import HSVGradient from './HSVGradient';
import ColorInput from '../ColorInput';
import ColorPalette from '../ColorPalette';
import HueSlider from './HueSlider';
import AlphaSlider from './AlphaSlider';
import { getCssColor, parse as colorParse, validateColor } from '../../helpers/colorTool';
import uncontrolled from '../../helpers/uncontrolled';
import * as CommonTypes from '../../helpers/commonTypes';
import useTranslate from '../../helpers/useTranslate';

const RootBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme?.palette?.background?.paper || '#fff',
  position: 'relative',
  width: 'min-content',
  height: 'min-content',
  padding: '0px',
}));

const Container = styled(Box)(({ boxWidth }) => ({
  justifyContent: 'space-around',
  overflow: 'hidden',
  width: boxWidth,
  padding: 0,
}));

const HsvGradientBox = styled('div')(({ boxWidth }) => ({
  width: `calc(${boxWidth}px - 16px)`,
  height: 'calc(128px - 16px)',
  margin: 8,
}));

const SlidersBox = styled('div')(({ boxWidth }) => ({
  width: boxWidth,
  padding: '8px 8px 4px 8px',
}));

const InputsBox = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  padding: '8px 4px 8px 8px',
  justifyContent: 'space-between',
});

const ColorBg = styled('div')({
  width: 48,
  height: 48,
  background:
    'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(135deg, transparent 75%, #ccc 75%)',
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 4px 0, 4px -4px, 0px 4px',
  backgroundColor: 'white',
  borderRadius: 4,
});

const ColorDisplay = styled('div')(({ backgroundColor, colorError }) => ({
  width: 48,
  height: 48,
  background: colorError
    ? `repeating-linear-gradient(135deg, transparent, transparent 29px, #f44336 29px, #f44336 32px)`
    : 'none',
  backgroundColor: colorError ? 'transparent' : backgroundColor,
  borderRadius: 4,
  border: colorError ? '2px solid #f44336' : 'none',
}));

const ControlsBox = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  padding: 8,
  '& > button': {
    marginLeft: 'auto',
  },
});

const ErrorText = styled('span')({
  color: '#f44336',
  lineHeight: '36.5px',
});

const ColorBox = ({
  value,
  palette,
  inputFormats,
  deferred,
  onChange: _onChange,
  disableAlpha,
  hslGradient,
  ...props
}) => {
  const { t, i18n } = useTranslate();
  let color = validateColor(value, disableAlpha, t, i18n.language);
  let onChange = _onChange;
  let onDeferredChange;
  if (deferred) {
    [color, onChange] = React.useState(color);
    onDeferredChange = _onChange;
  }

  const { hsv, hsl } = color;
  let { alpha } = color;
  alpha = alpha === undefined ? 100 : Math.floor(alpha * 100);
  const cssColor = getCssColor(color, 'hex', true);
  const { backgroundColor } = color.css;
  const boxWidth = 320;

  const handleSet = () => {
    onDeferredChange(color);
  };

  const handleHueChange = (event, newValue) => {
    const c = colorParse([newValue, color.hsv[1], color.hsv[2]], 'hsv');
    onChange(c);
  };

  const handleAlphaChange = (event, newValue) => {
    const alphaVal = newValue / 100;
    const c = colorParse([color.rgb[0], color.rgb[1], color.rgb[2], alphaVal], 'rgb');
    onChange(c);
  };

  const handleSVChange = hsvVal => {
    const c = colorParse(hsvVal, hslGradient ? 'hsl' : 'hsv');
    onChange(c);
  };

  const handlePaletteSelection = (name, colour) => {
    const c = colorParse(colour);
    c.name = name;
    onChange(c);
  };

  const handleInputChange = newValue => {
    const c = colorParse(newValue);
    onChange(c);
  };

  const displayInput = () =>
    inputFormats.length > 0 && (
      <InputsBox className="muicc-colorbox-inputs">
        <ColorBg className="muicc-colorbox-colorBg">
          <ColorDisplay
            className="muicc-colorbox-color"
            backgroundColor={backgroundColor}
            colorError={!!color.error}
          />
        </ColorBg>
        {inputFormats.map(input => (
          <ColorInput
            key={input}
            value={color}
            format={input}
            disableAlpha
            enableErrorDisplay={false}
            className="muicc-colorbox-input"
            onChange={handleInputChange}
          />
        ))}
      </InputsBox>
    );

  return (
    <RootBox p={2} className="muicc-colorbox-root" {...props}>
      <Container boxWidth={boxWidth}>
        <HsvGradientBox boxWidth={boxWidth} className="muicc-colorbox-hsvgradient">
          <HSVGradient color={color} onChange={handleSVChange} isHsl={hslGradient} />
        </HsvGradientBox>
        <SlidersBox boxWidth={boxWidth} className="muicc-colorbox-sliders">
          <HueSlider
            data-testid="hueslider"
            aria-label="color slider"
            value={hslGradient ? hsl[0] : hsv[0]}
            min={0}
            max={360}
            onChange={handleHueChange}
          />
          {!disableAlpha && (
            <AlphaSlider
              data-testid="alphaslider"
              color={cssColor}
              valueLabelDisplay="auto"
              aria-label="alpha slider"
              value={alpha}
              min={0}
              max={100}
              onChange={handleAlphaChange}
            />
          )}
        </SlidersBox>
        {displayInput(inputFormats)}
        {palette && (
          <>
            <Divider />
            <ColorPalette
              size={26.65}
              palette={palette}
              onSelect={handlePaletteSelection}
              disableAlpha={disableAlpha}
            />
          </>
        )}
        <ControlsBox className="muicc-colorbox-controls">
          {color.error && (
            <ErrorText className="muicc-colorbox-error" data-testid="colorbox-error">
              {t(color.error)}
            </ErrorText>
          )}
          {deferred && <Button onClick={handleSet}>{t('Set')}</Button>}
        </ControlsBox>
      </Container>
    </RootBox>
  );
};

ColorBox.propTypes = {
  value: CommonTypes.color,
  deferred: PropTypes.bool,
  palette: CommonTypes.palette,
  inputFormats: CommonTypes.inputFormats,
  onChange: PropTypes.func.isRequired,
  disableAlpha: PropTypes.bool,
  hslGradient: PropTypes.bool,
};

ColorBox.defaultProps = {
  value: undefined,
  deferred: false,
  palette: undefined,
  inputFormats: ['hex', 'rgb'],
  disableAlpha: false,
  hslGradient: false,
};

export default uncontrolled(ColorBox);