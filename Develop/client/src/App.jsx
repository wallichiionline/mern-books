import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import {ApolloClient, InMemoryCache, ApolloProvider, createHttpLink} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import SearchBooks from './pages/SearchBooks';
import SavedBooks from "./pages/SavedBooks";

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
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <>
      <Navbar />
      <Routes>
        <Route exact path= "/" component={SearchBooks}></Route>
        <Route exact path= "/saved" component={SavedBooks}></Route>
        <Route render ={() => <h1>Wrong page!</h1>}></Route>
      </Routes>
    </>
    </ApolloProvider>
  );
}

export default App;
