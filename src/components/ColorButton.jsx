import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import * as ColorTool from '../helpers/colorTool';
import * as CommonTypes from '../helpers/commonTypes';
import useTranslate from '../helpers/useTranslate';

const StyledButton = styled(Button, {
  shouldForwardProp: (prop) =>
    !['width', 'minWidth', 'height', 'hoverColor', 'borderColor', 'borderWidth', 'alpha', 'colorError', 'backgroundColor'].includes(prop),
})(({ theme, ...props }) => ({
  backgroundImage:
    props.colorError || props.alpha < 1
      ? `linear-gradient(45deg, #ccc 25%, transparent 25%), 
         linear-gradient(135deg, #ccc 25%, transparent 25%),
         linear-gradient(45deg, transparent 75%, #ccc 75%),
         linear-gradient(135deg, transparent 75%, #ccc 75%)`
      : 'none',
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 4px 0, 4px -4px, 0px 4px',
  backgroundColor: props.backgroundColor || '#fff',
  boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
  borderColor: props.borderColor || '#767676',
  borderStyle: 'solid',
  borderWidth: props.borderWidth || 0,
  borderRadius: 4,
  padding: 0,
  width: props.width,
  minWidth: props.minWidth,
  height: props.height,
  '& div': {
    content: '" "',
    background:
      props.colorError
        ? `repeating-linear-gradient(
            135deg,
            transparent,
            transparent ${props.width / 2 + 2}px,
            #f44336 ${props.width / 2 + 2}px,
            #f44336 ${props.width / 2 + 4}px
          )`
        : 'none',
    backgroundColor: props.colorError ? 'transparent' : props.backgroundColor || '#fff',
    width: props.width,
    minWidth: props.minWidth,
    height: props.height,
    border: props.colorError
      ? '2px solid #f44336'
      : `${props.borderWidth || 0}px solid ${props.borderColor || '#767676'}`,
    borderRadius: 4,
    padding: 0,
  },
  '&:hover div': {
    backgroundColor: props.hoverColor,
  },
  '&:active': {
    boxShadow: 'none',
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.5)',
  },
}));

const TooltipWrapper = styled('div')({
  width: 'min-content',
});

const ColorButton = ({
  color: c,
  size,
  borderWidth,
  borderColor,
  forwardRef,
  tooltip,
  disableAlpha,
  className,
  ...props
}) => {
  const { t, i18n } = useTranslate();
  const color = ColorTool.validateColor(c, disableAlpha, t, i18n.language);
  const translated = t(tooltip);
  const cssColor = color.css;
  let l = color.hsl[2] - 10;
  if (l < 30) l = color.hsl[2] + 50;
  const a = color.alpha;
  const hoverColor = `hsl(${color.hsl[0]}, ${color.hsl[1]}%, ${l}%, ${a})`;

  const component = (
    <StyledButton
      data-testid="colorbutton"
      className={className}
      ref={forwardRef}
      variant="contained"
      aria-label={color.name}
      width={size}
      minWidth={size}
      height={size}
      hoverColor={hoverColor}
      borderColor={borderColor}
      borderWidth={borderWidth}
      alpha={a}
      colorError={!!color.error}
      backgroundColor={cssColor.backgroundColor}
      {...props}
    >
      <div />
    </StyledButton>
  );

  if (tooltip) {
    return (
      <Tooltip title={translated}>
        <TooltipWrapper>{component}</TooltipWrapper>
      </Tooltip>
    );
  }
  return component;
};

ColorButton.propTypes = {
  color: CommonTypes.color.isRequired,
  size: PropTypes.number,
  disableAlpha: PropTypes.bool,
  borderWidth: PropTypes.number,
  borderColor: PropTypes.string,
  tooltip: PropTypes.string,
  forwardRef: PropTypes.shape({ current: PropTypes.elementType }),
};

ColorButton.defaultProps = {
  size: 24,
  borderWidth: 0,
  borderColor: undefined,
  forwardRef: undefined,
  tooltip: undefined,
  disableAlpha: false,
};

export default ColorButton;