import React from "react";
import { Connector } from "@b1b2/components.providers.connector";

import { PrimeReactProvider } from "primereact/api";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// - Router
import { Router } from "./router";

const Root: React.FC = () => {
  return (
    <Connector app={bootstrap}>
      <PrimeReactProvider>
        <QueryClientProvider client={https}>
          <Router />
        </QueryClientProvider>
      </PrimeReactProvider>
    </Connector>
  );
};

const https = new QueryClient();

const bootstrap = "@dashboard";

export default Root;
