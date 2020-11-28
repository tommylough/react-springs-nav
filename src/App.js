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
let selectedIndex = null;
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

function TheThing({ id }) {
  const history = useHistory();
  return (
    <>
      <Button
        onClick={() => {
          history.push("/");
        }}
      >
        Back
      </Button>
      <Main>
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

function Todos({ id }) {
  return TheThing({ id });
}

function People({ id }) {
  return TheThing({ id });
}

function Invitations({ id }) {
  return TheThing({ id });
}

function Home() {
  //const [selectedIndex, setSelectedIndex] = useState();
  const [open, setOpen] = useState(true);
  const [springs, setSpring] = useSprings(panels.length, (index) => {
    if (selectedIndex || selectedIndex === 0) {
      if (index === selectedIndex) {
        return {
          ...panels[index],
          top: 0,
          height: window.innerHeight,
        };
      } else {
        return {
          ...panels[index],
          top: (panels[index].top = index * 160),
          marginLeft: -820,
        };
      }
    } else {
      return panels[index];
    }
  });
  const history = useHistory();

  useEffect(() => {
    console.log("on load", selectedIndex);
    if (selectedIndex || selectedIndex === 0) {
      setSpring((index) => {
        if (index === selectedIndex) {
          return {
            top: (panels[index].top = index * 160),
            height: panels[index].height,
          };
        } else {
          return {
            delay: 300,
            to: {
              marginLeft: panels[index].marginLeft,
            },
          };
        }
      });
    } else {
      setSpring((index) => ({
        top: (panels[index].top = index * 160),
      }));
    }
  }, [setSpring]);

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
        console.log("onRest", id, panels[id].route);
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
    selectedIndex = id;
    setSpring((index) => {
      return index === id ? animateSelected(id) : animateUnselected(id);
    });
  };

  const handleClick = (e, id) => {
    setSelected(id);
    setOpen(!open);
  };

  return (
    <>
      <Button
        onClick={() => {
          history.push("/");
        }}
      >
        Back
      </Button>
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
            render={(props) => <Home {...props} id={null} />}
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
