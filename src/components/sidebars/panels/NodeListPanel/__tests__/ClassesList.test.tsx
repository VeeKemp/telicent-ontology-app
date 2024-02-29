import { screen } from "@testing-library/react";
import ClassesList from "../ClassesList";
import { renderWithProviders } from "../../../../../testUtils";

/**
 * Skipping tests as test suite was commented out 2 months ago.
 * https://github.com/telicent-oss/telicent-ontology-app/issues/168
 */
test.skip("renders ClassesList component", () => {
  renderWithProviders(<ClassesList show />);
  const linkElement = screen.getByText(/classes-list/i);
  expect(linkElement).toBeInTheDocument();
});
