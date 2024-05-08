import ResizeObserver from "resize-observer-polyfill";
import React from 'react';

import * as Declarative from 'react-declarative';
import * as MuiMaterial from '@mui/material';
import * as MuiIcons from '@mui/icons-material';

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver;
}

window.React = React;
window.Declarative = Declarative;
window.MuiMaterial = MuiMaterial;
window.MuiIcons = MuiIcons;
window.material =  MuiMaterial;
window.iconsMaterial = MuiIcons;
