import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AlertDialog from '../AlertDialog';


describe('AlertDialog', () => {
  it('renders correctly', () => {
    const { getByText } = render(
      <AlertDialog
        open={true}
        title="Test Title"
        content="Test Content"
        onAccept={() => { }}
        onClose={() => { }}
      />
    );

    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup()

    const onClose = jest.fn();
    const { getByText } = render(
      <AlertDialog
        open={true}
        title="Test Title"
        content="Test Content"
        onAccept={() => { }}
        onClose={onClose}
      />
    );

    await user.click(getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onAccept when OK button is clicked', async () => {
    const user = userEvent.setup()

    const onAccept = jest.fn();
    const { getByText } = render(
      <AlertDialog
        open={true}
        title="Test Title"
        content="Test Content"
        onAccept={onAccept}
        onClose={() => { }}
      />
    );

    await user.click(getByText('OK'));
    expect(onAccept).toHaveBeenCalled();
  });
});
