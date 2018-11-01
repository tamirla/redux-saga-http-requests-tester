
import { handleAction } from 'redux-actions';
import * as actions from './actions';

const app = handleAction(
  actions.init, state => ({
    ...state,
    initialized: true,
  }),
  {
    initialized: false,
  },
);

export default app;
