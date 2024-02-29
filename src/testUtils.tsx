import React from "react";
import { RenderOptions, render } from "@testing-library/react";
import { Provider as ReduxProvider } from "react-redux";
import userEvent from "@testing-library/user-event";
import { RootState, setupStore } from "./store";

type RenderWithProvidersOptions = RenderOptions & {
  preloadedState: Partial<RootState>;
};

type TestProvidersProps = Pick<RenderWithProvidersOptions, "preloadedState"> & {
  children: React.ReactNode;
};

const user = userEvent.setup();

const TestProviders: React.FC<TestProvidersProps> = ({
  preloadedState,
  children,
}) => (
  <ReduxProvider store={setupStore(preloadedState)}>{children}</ReduxProvider>
);

export const renderWithProviders = (
  ui: JSX.Element,
  options: Partial<RenderWithProvidersOptions> = {}
) => {
  const { preloadedState = {}, ...renderOptions } = options;

  const rendered = render(
    <TestProviders preloadedState={preloadedState}>{ui}</TestProviders>,
    renderOptions
  );

  return { user, ...rendered };
};

export const renderWithUser = (ui: JSX.Element, options?: RenderOptions) => ({
  user,
  ...render(ui, options),
});
