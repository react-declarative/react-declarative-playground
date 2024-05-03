import ResizeObserver from "resize-observer-polyfill";
import React from 'react';

import * as Declarative from 'react-declarative';

if (!window.ResizeObserver) {
  window.ResizeObserver = ResizeObserver;
}

window.React = React;
window.Declarative = Declarative;
