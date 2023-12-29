import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import { langs, loadLanguage } from "@uiw/codemirror-extensions-langs";

import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

// - Root Component
import Root from "./root.component";

// - Code Mirror

/**
 * @description
 * @see https://uiwjs.github.io/react-codemirror/#/extensions/languages
 */
loadLanguage("json");

langs.json();

library.add(fas);

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    return <>Something went wrong</>;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
