import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import EventListPage from "./components/pages/EventsListPage";
import HomePage from "./components/pages/HomePage";
import RegistEventPage from "./components/pages/RegistEventPage";

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/listEvents" component={EventListPage} exact />
        <Route path="/editEvent/:id" component={RegistEventPage} exact />
        <Route path="/registEvent" component={RegistEventPage} exact />
        <Route path="/" component={HomePage} exact />
      </Switch>
    </Router>
  );
};

export default App;