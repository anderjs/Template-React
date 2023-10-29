import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";

// - Root Component
import Root from "./root.component";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    return <>Something went wrong</>;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
