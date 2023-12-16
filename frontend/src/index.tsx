/* @refresh reload */
import { render } from 'solid-js/web';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@merged/solid-apollo';
import { Suspense } from 'solid-js';
import './index.css';
import App from './App';
import { Router, Route } from '@solidjs/router';
import Hero from './Hero';

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
          <Route path="/" component={Hero} />
          <Route path="/app" component={App} />
        </Router>
      </Suspense>
    </ApolloProvider>
  ),
  root!,
);
