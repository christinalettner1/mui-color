import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import * as CommonTypes from '../../helpers/commonTypes';
import useEventCallback from '../../helpers/useEventCallback';

const getRGB = _h => {
  let rgb;
  const h = _h / 360;
  let v = 255;
  let i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = 0;
  const q = Math.round(v * (1 - f));
  const t = Math.round(v * f);
  v = Math.round(v);
  i %= 6;
  if (i === 0) rgb = [v, t, p];
  else if (i === 1) rgb = [q, v, p];
  else if (i === 2) rgb = [p, v, t];
  else if (i === 3) rgb = [p, q, v];
  else if (i === 4) rgb = [t, p, v];
  else rgb = [v, p, q];
  return rgb;
};

const Root = styled('div')(({ cssRgb }) => ({
  position: 'absolute',
  width: 'inherit',
  height: 'inherit',
  background: `${cssRgb} none repeat scroll 0% 0%`,
  margin: 0,
}));

const GradientPosition = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '100%',
});

const GradientS = styled('div')({
  background:
    'rgba(0, 0, 0, 0) linear-gradient(to right, rgb(255, 255, 255), rgba(255, 255, 255, 0)) repeat scroll 0% 0%',
});

const GradientV = styled('div')({
  background:
    'rgba(0, 0, 0, 0) linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0)) repeat scroll 0% 0%',
});

const GradientS_HSL = styled('div')({
  background:
    'rgba(0, 0, 0, 0) linear-gradient(to bottom, rgb(128, 128, 128), rgba(255, 255, 255, 0)) repeat scroll 0% 0%',
});

const GradientL_HSL = styled('div')({
  background:
    'rgba(0, 0, 0, 0) linear-gradient(to left, rgb(0, 0, 0), rgba(128, 128, 128, 0), rgb(255, 255, 255)) repeat scroll 0% 0%',
});

const Cursor = styled('div')(({ pressed }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  borderColor: '#f0f0f0',
  borderWidth: 1,
  borderStyle: 'solid',
  boxShadow: 'rgba(0, 0, 0, 0.37) 0px 1px 4px 0px',
  transition: 'box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  borderRadius: 4,
  cursor: !pressed ? 'pointer' : 'default',
  zIndex: 100,
  transform: 'translate(-4px, -4px)',
  '&:hover': {
    boxShadow: '0px 0px 0px 8px rgba(63, 81, 181, 0.16)',
  },
  '&:focus': {
    outline: 'none !important',
    boxShadow: '0px 0px 0px 8px rgba(63, 81, 181, 0.16)',
  },
}));

const CursorCenter = styled('div')({
  width: 8,
  height: 8,
  borderRadius: 4,
  boxShadow: 'white 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
});

const HSVGradient = ({ className, color, onChange, isHsl, ...props }) => {
  const latestColor = React.useRef(color);
  const [focus, onFocus] = React.useState(false);
  const pressed = React.useRef(false);
  const box = React.useRef();
  const cursor = React.useRef();
  let cursorPos = { x: 0, y: 0 };
  const rgb = getRGB(color.hsv[0]);
  const cssRgb = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;

  const setPosition = (pos, f) => {
    cursorPos = pos;
    cursor.current.style.top = `${pos.y}px`;
    cursor.current.style.left = `${pos.x}px`;
    if (f) cursor.current.focus();
  };

  const initPosition = ref => {
    if (ref) {
      const { hsv, hsl } = color;
      cursorPos = {
        x: Math.round(((isHsl ? 100 - hsl[2] : hsv[1]) / 100) * (ref.clientWidth - 1)),
        y: Math.round(((isHsl ? hsl[1] : 100 - hsv[2]) / 100) * (ref.clientHeight - 1)),
      };
      setPosition(cursorPos);
    }
  };

  React.useEffect(() => {
    const ref = box.current;
    initPosition(ref);
    if (ref) ref.style.background = `${cssRgb} none repeat scroll 0% 0%`;

    const convertMousePosition = ({ x, y }, ref) => {
      const bounds = ref.getBoundingClientRect();
      const pos = { x: x - bounds.left, y: y - bounds.top };
      pos.x = Math.max(0, Math.min(pos.x, ref.clientWidth - 1));
      pos.y = Math.max(0, Math.min(pos.y, ref.clientHeight - 1));
      setPosition(pos, true);
      const c = latestColor.current;
      if (isHsl) {
        const s = (pos.y / (ref.clientHeight - 1)) * 100;
        const l = (1 - pos.x / (ref.clientWidth - 1)) * 100;
        onChange([c.hsl[0], s, l]);
      } else {
        const s = (pos.x / (ref.clientWidth - 1)) * 100;
        const v = (1 - pos.y / (ref.clientHeight - 1)) * 100;
        onChange([c.hsv[0], s, v]);
      }
    };

    const handleDown = event => {
      onFocus(true);
      pressed.current = true;
      event.preventDefault();
    };
    const handleUp = event => {
      const xy = { x: event.pageX - window.scrollX, y: event.pageY - window.scrollY };
      convertMousePosition(xy, ref);
      pressed.current = false;
      event.preventDefault();
    };
    const handleMove = event => {
      if (pressed.current && event.buttons) {
        const xy = { x: event.pageX - window.scrollX, y: event.pageY - window.scrollY };
        convertMousePosition(xy, ref);
        event.preventDefault();
      }
    };
    const handleTouch = event => {
      const xy = { x: event.touches[0].pageX - window.scrollX, y: event.touches[0].pageY - window.scrollY };
      convertMousePosition(xy, ref);
      event.preventDefault();
    };

    ref.addEventListener('mousedown', handleDown);
    ref.addEventListener('mouseup', handleUp);
    ref.addEventListener('mousemove', handleMove);
    ref.addEventListener('touchdown', handleDown);
    ref.addEventListener('touchup', handleUp);
    ref.addEventListener('touchmove', handleTouch);
    return () => {
      ref.removeEventListener('mousedown', handleDown);
      ref.removeEventListener('mouseup', handleUp);
      ref.removeEventListener('mousemove', handleMove);
      ref.removeEventListener('touchdown', handleDown);
      ref.removeEventListener('touchup', handleUp);
      ref.removeEventListener('touchmove', handleTouch);
    };
  }, [color, isHsl, onChange]);

  const handleKey = useEventCallback(event => {
    if (!focus) return;
    let { x, y } = cursorPos;
    switch (event.key) {
      case 'ArrowRight': x += 1; break;
      case 'ArrowLeft': x -= 1; break;
      case 'ArrowDown': y += 1; break;
      case 'ArrowUp': y -= 1; break;
      case 'Tab': onFocus(false); return;
      default: return;
    }
    event.preventDefault();
    const bounds = box.current.getBoundingClientRect();
    const xy = { x: x + bounds.left, y: y + bounds.top };
    const ref = box.current;
    const boundsLimited = {
      x: Math.max(0, Math.min(x, ref.clientWidth - 1)),
      y: Math.max(0, Math.min(y, ref.clientHeight - 1)),
    };
    setPosition(boundsLimited);
    if (isHsl) {
      const s = (boundsLimited.y / (ref.clientHeight - 1)) * 100;
      const l = (1 - boundsLimited.x / (ref.clientWidth - 1)) * 100;
      onChange([color.hsl[0], s, l]);
    } else {
      const s = (boundsLimited.x / (ref.clientWidth - 1)) * 100;
      const v = (1 - boundsLimited.y / (ref.clientHeight - 1)) * 100;
      onChange([color.hsv[0], s, v]);
    }
  });

  const handleFocus = useEventCallback(event => {
    onFocus(true);
    event.preventDefault();
  });

  const handleBlur = useEventCallback(event => {
    onFocus(false);
    event.preventDefault();
  });

  return (
    <div className={className}>
      <Root ref={box} cssRgb={cssRgb} data-testid="hsvgradient-color" {...props}>
        <GradientPosition as={isHsl ? GradientS_HSL : GradientS}>
          <GradientPosition as={isHsl ? GradientL_HSL : GradientV}>
            <Cursor
              ref={cursor}
              tabIndex="0"
              role="slider"
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={color.hsv[1]}
              pressed={pressed.current}
              data-testid="hsvgradient-cursor"
              onKeyDown={handleKey}
              onFocus={handleFocus}
              onBlur={handleBlur}
            >
              <CursorCenter />
            </Cursor>
          </GradientPosition>
        </GradientPosition>
      </Root>
    </div>
  );
};

HSVGradient.propTypes = {
  color: CommonTypes.color.isRequired,
  className: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  isHsl: PropTypes.bool,
};

HSVGradient.defaultProps = {
  isHsl: false,
};

export default HSVGradient;
