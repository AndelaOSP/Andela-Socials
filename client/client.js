import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';

const cache = new InMemoryCache();
const httpLink = new HttpLink({
  uri: process.env.API_URI
});

const Client = new ApolloClient({
  link: httpLink,
  cache
});

export default Client;
