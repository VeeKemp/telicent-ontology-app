import { render, screen } from '@testing-library/react';
import ErrorMessage from '../ErrorMessage';

test('renders ErrorMessage component with correct message', () => {
  const testMessage = 'Test error message';
  render(<ErrorMessage message={testMessage} />);
  const messageElement = screen.getByText(testMessage);
  expect(messageElement).toBeInTheDocument();
});
