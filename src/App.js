import ReactDOM from "react-dom";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useHistory,
} from "react-router-dom";

import { useSprings } from "react-spring";
import { Main, GlobalStyle, Panel, Button } from "./styles";

const topOffset = 20;
const panels = [
  {
    title: "Panel1",
    marginLeft: 0,
    top: window.innerHeight - topOffset,
    height: 120,
    background: "blue",
    opacity: 1,
    route: "/todos",
  },
  {
    title: "Panel2",
    marginLeft: 0,
    top: window.innerHeight - topOffset,
    height: 120,
    background: "green",
    opacity: 1,
    route: "/people",
  },
  {
    title: "Panel3",
    marginLeft: 0,
    top: window.innerHeight - topOffset,
    height: 120,
    background: "red",
    opacity: 1,
    route: "/invitations",
  },
];

function Todos({ id, handleClick }) {
  const history = useHistory();
  return (
    <>
      <Main>
        <Button
          onClick={() => {
            history.push("/");
          }}
        >
          Back
        </Button>
        <GlobalStyle />
        <Panel
          style={{
            top: 0,
            marginLeft: panels[id].marginLeft,
            height: window.innerHeight,
          }}
          background={panels[id].background}
        >
          <p>{panels[id].title}</p>
        </Panel>
      </Main>
    </>
  );
}

function People({ id, handleClick }) {
  const history = useHistory();
  return (
    <>
      <Main>
        <Button
          onClick={() => {
            history.push("/");
          }}
        >
          Back
        </Button>
        <GlobalStyle />
        <Panel
          style={{
            top: 0,
            marginLeft: panels[id].marginLeft,
            height: window.innerHeight,
          }}
          background={panels[id].background}
        >
          <p>{panels[id].title}</p>
        </Panel>
      </Main>
    </>
  );
}

function Invitations({ id, handleClick }) {
  const history = useHistory();
  return (
    <>
      <Main>
        <Button
          onClick={() => {
            history.push("/");
          }}
        >
          Back
        </Button>
        <GlobalStyle />
        <Panel
          style={{
            top: 0,
            marginLeft: panels[id].marginLeft,
            height: window.innerHeight,
          }}
          background={panels[id].background}
        >
          <p>{panels[id].title}</p>
        </Panel>
      </Main>
    </>
  );
}

function Panels() {
  //const [selectedIndex, setSelectedIndex] = useState(null);
  const [open, setOpen] = useState(true);
  const history = useHistory();

  useEffect(() => {
    console.log("on load");
    setSpring((index) => ({
      top: (panels[index].top = index * 160),
    }));
  }, []);

  useEffect(() => {
    return () => {
      console.log("will unmount");
    };
  }, []);

  const animateSelected = (id) => {
    return {
      delay: open ? 300 : 0,
      to: async (next, cancel) => {
        await next({
          top: open ? 0 : (panels[id].top = id * 160),
          height: window.innerHeight,
        });
        //await next({ height: window.innerHeight });
      },
      onRest: () => {
        console.log("onRest", id);
        history.push(panels[id].route);
      },
    };
  };
  const animateUnselected = (id) => {
    return {
      delay: open ? 0 : 160,
      to: {
        marginLeft: open ? -820 : panels[id].marginLeft,
      },
    };
  };

  const setSelected = (id) => {
    setSpring((index) => {
      return index === id ? animateSelected(id) : animateUnselected(id);
    });
  };

  const [springs, setSpring] = useSprings(
    panels.length,
    (index) => panels[index]
  );

  const handleClick = (e, id) => {
    setSelected(id);
    setOpen(!open);
  };

  return (
    <>
      <Main>
        <GlobalStyle />
        <>
          {springs.map((props, index) => {
            console.log("dom", index);
            return (
              <Panel
                key={index}
                style={props}
                onClick={(e) => handleClick(e, index)}
              >
                <p>{panels[index].title}</p>
              </Panel>
            );
          })}
        </>
      </Main>
    </>
  );
}

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => <Panels {...props} id={null} />}
          />
          <Route
            exact
            path="/todos"
            render={(props) => <Todos {...props} id={0} />}
          />
          <Route
            exact
            path="/people"
            render={(props) => <People {...props} id={1} />}
          />
          <Route
            exact
            path="/invitations"
            render={(props) => <Invitations {...props} id={2} />}
          />
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </>
  );
}

export default App;
