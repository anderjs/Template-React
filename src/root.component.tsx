import React from "react";
import { Host } from "@learlifyweb/providers.host";

import { I18nextProvider } from "react-i18next";
import { PrimeReactProvider } from "primereact/api";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// - Router
import { Router } from "./router";

// - i18next
import i18n from "./root.i18next";

const Root = () => {
  return (
    <React.Suspense fallback={<div />}>
      <I18nextProvider i18n={i18n}>
        <Host app={bootstrap}>
          <PrimeReactProvider>
            <QueryClientProvider client={https}>
              <Router />
            </QueryClientProvider>
          </PrimeReactProvider>
        </Host>
      </I18nextProvider>
    </React.Suspense>
  );
};

const https = new QueryClient();

const bootstrap = "@dashboard";

export default Root;
