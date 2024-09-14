import './App.css';
import { Outlet, Route } from 'react-router-dom';
import Navbar from './components/Navbar';

import {ApolloClient, InMemoryCashe, ApolloProvider, createHttpLink} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";

const httpLink = createHttpLink({url: "/graphql"});
const authLink = setContext((_,{headers}) => {
  const token = localStorage.getItem("token");
  return{
    headers:{
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cashe: new InMemoryCashe(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
      <>
      <Navbar />
      <Switch>
        <Route exact path= "/" component={SearchBooks}></Route>
        <Route exact path= "/saved" component={SavedBooks}></Route>
        <Route render ={() => <h1>Wrong page!</h1>}></Route>
      </Switch>
    </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
