import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import styled from 'styled-components';

import Home from "@/pages/home";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f1f1;
`;


export default function Routes () :React.ReactElement {
  return (
    <Wrapper>
      <Router>
        <Switch>
          <Route exact path="/"><Home /></Route>
        </Switch>
      </Router>
    </Wrapper>
  )
}