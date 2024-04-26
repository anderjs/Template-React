import React from "react";
import { createBrowserHistory } from "history";
import { render, screen } from "@testing-library/react";

// - Act
import { Router } from "./router";

// Mock the Demo component
jest.mock("./views/Template", () => () => <Mock />);

describe("Router component", () => {
  it("should render the Demo component for /demo route", () => {
    const history = createBrowserHistory();

    history?.push("/demo");

    render(<Router />);

    expect(screen.getByText("Template works!")).toBeInTheDocument();
  });
});

/**
 * @description
 * Mock React Component.
 */
const Mock: React.FC = () => <div>Template works!</div>;
