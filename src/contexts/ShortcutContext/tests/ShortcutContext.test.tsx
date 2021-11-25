import { render, fireEvent } from "@testing-library/react";
import { ReactNode } from "react";
import { ShortcutProvider, useShortcut } from "../ShortcutContext";

function Container({ children }: { children: ReactNode }) {
  return <ShortcutProvider>{children}</ShortcutProvider>;
}

it("listens for the provided shortcuts", () => {
  const component1Listener = jest.fn();
  const component2Listener = jest.fn();
  function Component1() {
    useShortcut(["CtrlCmd", "C"], component1Listener);
    return <p>1</p>;
  }
  function Component2() {
    useShortcut(["H", "I"], component2Listener);
    return <p>2</p>;
  }

  render(
    <Container>
      <Component1 />
      <Component2 />
    </Container>
  );

  fireEvent.keyDown(document, {
    key: "Control",
  });
  fireEvent.keyDown(document, {
    key: "c",
  });
  fireEvent.keyUp(document, {
    key: "c",
  });
  fireEvent.keyUp(document, {
    key: "Control",
  });

  expect(component1Listener).toHaveBeenCalledTimes(1);
  expect(component2Listener).not.toHaveBeenCalled();
});

it("does not call anything when a non-shortcut combination is pressed", () => {
  const component1Listener = jest.fn();
  const component2Listener = jest.fn();
  function Component1() {
    useShortcut(["CtrlCmd", "C"], component1Listener);
    return <p>1</p>;
  }
  function Component2() {
    useShortcut(["H", "I"], component2Listener);
    return <p>2</p>;
  }

  render(
    <Container>
      <Component1 />
      <Component2 />
    </Container>
  );

  fireEvent.keyDown(document, {
    key: "Shift",
  });
  fireEvent.keyDown(document, {
    key: "c",
  });
  fireEvent.keyUp(document, {
    key: "c",
  });
  fireEvent.keyUp(document, {
    key: "Control",
  });

  expect(component1Listener).not.toHaveBeenCalled();
  expect(component2Listener).not.toHaveBeenCalled();
});

it("errors when the same shortcut is registered by two components", () => {
  const component1Listener = jest.fn();
  const component2Listener = jest.fn();
  function Component1() {
    useShortcut(["CtrlCmd", "C"], component1Listener);
    return <p>1</p>;
  }
  function Component2() {
    useShortcut(["CtrlCmd", "C"], component2Listener);
    return <p>2</p>;
  }

  expect(() => {
    render(
      <Container>
        <Component1 />
        <Component2 />
      </Container>
    );
  }).toThrow();
});
