/* @refresh reload */
import { render } from 'solid-js/web';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@merged/solid-apollo';
import { Suspense } from 'solid-js';
import './index.css';
import App from './App';
import { Router, Route } from '@solidjs/router';
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error('Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?');
}

const client = new ApolloClient({
  uri: import.meta.env.VITE_API_URL,
  cache: new InMemoryCache(),
});

render(
  () => (
    <ApolloProvider client={client}>
      <Suspense fallback={<>App is loading…</>}>
        <Router>
          <Route path="/landing-page" component={LandingPage} />
          <Route path="/" component={App} />
          <Route path="/signup" component={SignUpPage} />
          <Route path="/signin" component={SignInPage} />
        </Router>
      </Suspense>
    </ApolloProvider>
  ),
  root!,
);
