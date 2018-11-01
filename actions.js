import { createAction } from 'redux-actions';
import { dispatchRequest } from 'redux-saga-http-requests';

import * as api from './apis';

export const init = createAction('INIT');

export const getTodos = () => dispatchRequest(api.GET_TODOS);
export const getUser = id => dispatchRequest(api.GET_USER, { id });
export const addPost = data => dispatchRequest(api.ADD_POST, data);
export const invalidRequest = () => dispatchRequest(api.INVALID_API);
