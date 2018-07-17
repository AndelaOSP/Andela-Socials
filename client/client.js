import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
} from 'apollo-boost';

const cache = new InMemoryCache();
const httpLink = new HttpLink({ uri: process.env.API_URI });

const Client = new ApolloClient({
  link: httpLink,
  cache,
});

export default Client;
