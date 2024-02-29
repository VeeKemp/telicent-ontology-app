import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import AlertMessages from '../AlertMessages';
import { store } from '../../../store';

describe('AlertMessages', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={store}>
        <AlertMessages />
      </Provider>
    );
  });
});
