import createSagaMiddleware from 'redux-saga';
import { takeEvery, all } from 'redux-saga/effects';
import {
  requestsWatcher,
  onAllRequestsFailed,
  onRequestCompleted,
  onRequestFailed,
} from 'redux-saga-http-requests';
import * as actions from './actions';
import * as apis from './apis';

function initWorker() {
  console.log('App Initialized !');
}

function* initWatcher() {
  yield takeEvery(actions.init, initWorker);
}

function* httpRequestCompletedWatcher() {
  yield onRequestCompleted(apis.GET_TODOS, props => console.log('http request completed', props));
}

function* specificHttpRequestFailureWatcher() {
  yield onRequestFailed(apis.INVALID_API, props => console.log('invalidRequest failed', props));
}

function* genericHttpRequestFailureWatcher() {
  yield onAllRequestsFailed(props => console.log('http request failed', props));
}


export const middleware = createSagaMiddleware();

export function* rootSaga() {
  yield all([
    initWatcher(),
    requestsWatcher(),
    httpRequestCompletedWatcher(),
    specificHttpRequestFailureWatcher(),
    genericHttpRequestFailureWatcher(),
  ]);
}
