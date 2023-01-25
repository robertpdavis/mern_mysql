import './App.css';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import User from './pages/User';
import Users from './pages/Users';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import Nav from './components/Nav';
import { ErrorBoundary } from 'react-error-boundary';

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/api',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});


const ErrorFallback = ({ error, resetErrorBoundary }) => {
  //General app error notification content
  //Capture authenticaton error
  if (error.message === 'Authentication error.' || 'Username or password error') {
    return (
      <main>
        <section className="container my-2">
          <div className="page-header">
            Authentication Error
          </div>
          <div className="fade alert alert-danger show">
            <div>
              Username or password error or not logged in.
            </div>
            <button onClick={resetErrorBoundary}>Try again</button>
          </div>
        </section>
      </main >
    )
  } else {

    return (
      <main>
        <section className="container my-2">
          <div className="page-header">
            Application Error
          </div>
          <div className="fade alert alert-danger show">
            <div>
              Sorry, something went wrong. If error pesists, please contact support.
            </div>
            <button onClick={resetErrorBoundary}>Try again</button>
          </div>
        </section>
      </main >
    )
  }
}


const errorHandler = (error, { componentStack: string }) => {
  console.log('Client errors', error.clientErrors)
  console.log('API errors', error.graphQLErrors)
  // TO DO - Do something with the error
  // E.g. log to an error logging client here
}

function App() {

  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="container">
          <Header />
          <Nav />
          <div className="container">
            <ErrorBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>
              <Routes>
                <Route
                  path="/"
                  element={<Home />}
                />
                <Route
                  path="/login/"
                  element={<Login />}
                />
                <Route
                  path="/signup/"
                  element={<Signup />}
                />
                <Route
                  path="/user/:id"
                  element={<User />}
                />
                <Route
                  path="/users/"
                  element={<Users />}
                />
                <Route
                  path="/profile/"
                  element={<Profile />}
                />
                <Route
                  path="*"
                  element={<Home />}
                />
              </Routes>
            </ErrorBoundary>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
