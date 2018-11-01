import React from 'react';
import {
  StyleSheet, Text, View, Button, ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { configureRequests } from 'redux-saga-http-requests';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './configureStore';
import * as actions from './actions';
import * as apis from './apis';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 50,
  },
});


const reducers = configureRequests({
  config: {
    baseURL: 'https://jsonplaceholder.typicode.com',
  },
  requests: {
    [apis.GET_TODOS]: {
      url: 'todos',
      store: 'todos',
    },
    [apis.GET_USER]: {
      url: 'users',
      store: 'user',
      // construct get url with given parameter
      urlBuilder: (url, { id }) => `${url}/${id}`,
      // optional handlers for request\ersponse
      requestHandler: (url, params) => {
        if (params.id === 2) {
          console.log('returning local response');
          return {
            id: 2,
            name: 'localUser',
          };
        }
        console.log('going to call ', url, ' with params', params);
        return null;
      },
      responseHandler: (params, response) => {
        console.log('got response for params', params, '->', response);
        return {
          ...response,
          requestParams: params,
        };
      },
    },
    [apis.ADD_POST]: {
      url: 'posts',
      store: 'newPost',
      method: 'post',
    },
    [apis.INVALID_API]: {
      url: 'invalid',
      store: 'invalid',
    },
  },
});

const { store, persistor } = configureStore(reducers);

const ApiTester = ({
  title, onPress, response: { data, error, isLoading },
}) => (
  <View style={{
    flex: 1, borderColor: 'black', borderWidth: 1, alignSelf: 'stretch',
  }}
  >
    <Button {...{ title, onPress }} />
    <ScrollView style={{ height: 100 }}>
      <Text>{isLoading ? 'loading...' : JSON.stringify(data)}</Text>
    </ScrollView>
    <Text style={{ color: 'red' }}>{error}</Text>
  </View>
);

const MainView = ({
  getTodos,
  getUser,
  addPost,
  invalidRequest,
  todos,
  user,
  newPost,
  invalid,
}) => (
  <View style={styles.container}>
    <Text style={styles.welcome}>Redux Saga Http Reuqests Tester</Text>
    <ApiTester title="get todos list" onPress={getTodos} response={todos} />
    <ApiTester title="get first user" onPress={() => getUser(1)} response={user} />
    <ApiTester title="get second user" onPress={() => getUser(2)} response={user} />
    <ApiTester
      title="add new post"
      onPress={() => addPost({
        title: 'foo',
        body: 'bar',
        userId: 1,
      })}
      response={newPost}
    />
    <ApiTester title="invalid request" onPress={invalidRequest} response={invalid} />
  </View>
);

const ConnectedMainView = connect(
  ({
    todos,
    user,
    newPost,
    invalid,
  }) => ({
    todos,
    user,
    newPost,
    invalid,
  }),
  {
    getTodos: actions.getTodos,
    getUser: actions.getUser,
    addPost: actions.addPost,
    invalidRequest: actions.invalidRequest,
  },
)(MainView);

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedMainView />
    </PersistGate>
  </Provider>
);


MainView.propTypes = {
  getTodos: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  addPost: PropTypes.func.isRequired,
  invalidRequest: PropTypes.func.isRequired,
  todos: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  newPost: PropTypes.shape({}).isRequired,
  invalid: PropTypes.shape({}).isRequired,
};

export default App;
