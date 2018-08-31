import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloLink,
} from 'apollo-boost';

const cache = new InMemoryCache();

const httpLink = new HttpLink({ uri: process.env.SERVER_API_BASE_URL });


const middlewareAuthLink = new ApolloLink((operation, forward) => {
  // The token should be gotten from the redux store or which ever location it is stored at login
  const token = localStorage.getItem('token');
  operation.setContext({ headers: { Token: token } });
  return forward(operation);
});

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);


const Client = new ApolloClient({
  link: httpLinkWithAuthToken,
  cache,
});

export default Client;
