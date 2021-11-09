import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChannelsList from "../ChannelsList";

it("uses the server name as a label", () => {
  render(
    <ChannelsList
      groups={[]}
      channelsByGroup={{}}
      serverName="Server name"
      selected={{ group: "A", channel: "1" }}
      onSelect={() => null}
    />
  );

  expect(screen.getByRole("listbox")).toHaveAccessibleName("Server name");
  expect(screen.getByText("Server name")).toBeInTheDocument();
});

it("lists the group names", () => {
  render(
    <ChannelsList
      groups={["A", "B", "C"]}
      channelsByGroup={{ A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] }}
      serverName="Server name"
      selected={{ group: "A", channel: "2" }}
      onSelect={() => null}
    />
  );

  const groups = screen.getAllByRole("group");
  expect(groups[0]).toHaveAccessibleName("A");
  expect(groups[1]).toHaveAccessibleName("B");
  expect(groups[2]).toHaveAccessibleName("C");

  // and also make sure these labels are actually shown somewhere in the document
  expect(screen.getByText("A")).toBeInTheDocument();
  expect(screen.getByText("B")).toBeInTheDocument();
  expect(screen.getByText("C")).toBeInTheDocument();
});

it("lists the child names in accessible groups", () => {
  const channelsByGroup = { A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] };

  render(
    <ChannelsList
      groups={["A", "B", "C"]}
      channelsByGroup={channelsByGroup}
      serverName="Server name"
      selected={{ group: "A", channel: "2" }}
      onSelect={() => null}
    />
  );

  const group1 = screen.getByLabelText("A");
  const group1Options = within(group1).getAllByRole("option");
  expect(group1Options[0]).toHaveAccessibleName("1");
  expect(group1Options[1]).toHaveAccessibleName("2");
  expect(group1Options[0]).toHaveTextContent("1");
  expect(group1Options[1]).toHaveTextContent("2");

  const group2 = screen.getByLabelText("B");
  const group2Options = within(group2).getAllByRole("option");
  expect(group2Options[0]).toHaveAccessibleName("2");
  expect(group2Options[1]).toHaveAccessibleName("3");
  expect(group2Options[2]).toHaveAccessibleName("4");
  expect(group2Options[0]).toHaveTextContent("2");
  expect(group2Options[1]).toHaveTextContent("3");
  expect(group2Options[2]).toHaveTextContent("4");

  const group3 = screen.getByLabelText("C");
  const group3Options = within(group3).getAllByRole("option");
  expect(group3Options[0]).toHaveAccessibleName("5");
  expect(group3Options[0]).toHaveTextContent("5");
});

it("calls onSelect when a channel name is clicked", () => {
  const onSelectMock = jest.fn();

  render(
    <ChannelsList
      groups={["A", "B", "C"]}
      channelsByGroup={{ A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] }}
      serverName="Server name"
      selected={{ group: "A", channel: "2" }}
      onSelect={onSelectMock}
    />
  );

  screen.getByText("3").click();

  expect(onSelectMock).toBeCalledWith({ group: "B", channel: "3" });
});

it("initially focuses the selected channel", () => {
  render(
    <ChannelsList
      groups={["A", "B", "C"]}
      channelsByGroup={{ A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] }}
      serverName="Server name"
      selected={{ group: "A", channel: "2" }}
      onSelect={() => null}
    />
  );

  userEvent.tab(); // going from document to channels list
  userEvent.tab(); // going from channels list to an individual channel

  expect(within(screen.getByLabelText("A")).getByText("2")).toHaveFocus();
});

it("moves focus up when the up arrow is pressed", () => {
  render(
    <ChannelsList
      groups={["A", "B", "C"]}
      channelsByGroup={{ A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] }}
      serverName="Server name"
      selected={{ group: "A", channel: "2" }}
      onSelect={() => null}
    />
  );

  userEvent.tab(); // going from document to channels list
  userEvent.tab(); // going from channels list to an individual channel

  const moveUp = () => {
    fireEvent.keyDown(document.activeElement as HTMLElement, {
      code: "ArrowUp",
      key: "ArrowUp",
      which: 38,
      keyCode: 38,
    });
  };

  moveUp();
  expect(within(screen.getByLabelText("A")).getByText("1")).toHaveFocus();

  // It should wrap around
  moveUp();
  expect(within(screen.getByLabelText("C")).getByText("5")).toHaveFocus();

  moveUp();
  expect(within(screen.getByLabelText("B")).getByText("4")).toHaveFocus();
});

it("moves focus down when the down arrow is pressed", () => {
  render(
    <ChannelsList
      groups={["A", "B", "C"]}
      channelsByGroup={{ A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] }}
      serverName="Server name"
      selected={{ group: "A", channel: "2" }}
      onSelect={() => null}
    />
  );

  userEvent.tab(); // going from document to channels list
  userEvent.tab(); // going from channels list to an individual channel

  const moveDown = () => {
    fireEvent.keyDown(document.activeElement as HTMLElement, {
      code: "ArrowDown",
      key: "ArrowDown",
      which: 38,
      keyCode: 38,
    });
  };

  moveDown();
  expect(within(screen.getByLabelText("B")).getByText("2")).toHaveFocus();

  moveDown();
  expect(within(screen.getByLabelText("B")).getByText("3")).toHaveFocus();

  moveDown();
  expect(within(screen.getByLabelText("B")).getByText("4")).toHaveFocus();

  moveDown();
  expect(within(screen.getByLabelText("C")).getByText("5")).toHaveFocus();

  moveDown();
  expect(within(screen.getByLabelText("A")).getByText("1")).toHaveFocus();
});

it("selects a channel when right arrow is pressed", () => {
  const onSelectMock = jest.fn();

  render(
    <ChannelsList
      groups={["A", "B", "C"]}
      channelsByGroup={{ A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] }}
      serverName="Server name"
      selected={{ group: "A", channel: "2" }}
      onSelect={onSelectMock}
    />
  );

  userEvent.tab(); // going from document to channels list
  userEvent.tab(); // going from channels list to an individual channel

  fireEvent.keyDown(document.activeElement as HTMLElement, {
    code: "ArrowUp",
    key: "ArrowUp",
    which: 38,
    keyCode: 38,
  });

  fireEvent.keyDown(document.activeElement as HTMLElement, {
    code: "ArrowRight",
    key: "ArrowRight",
    which: 38,
    keyCode: 38,
  });

  expect(onSelectMock).toBeCalledWith({ group: "A", channel: "1" });
});

it("selects a channel when enter is pressed", () => {
  const onSelectMock = jest.fn();

  render(
    <ChannelsList
      groups={["A", "B", "C"]}
      channelsByGroup={{ A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] }}
      serverName="Server name"
      selected={{ group: "A", channel: "2" }}
      onSelect={onSelectMock}
    />
  );

  userEvent.tab(); // going from document to channels list
  userEvent.tab(); // going from channels list to an individual channel

  fireEvent.keyDown(document.activeElement as HTMLElement, {
    code: "ArrowUp",
    key: "ArrowUp",
    which: 38,
    keyCode: 38,
  });

  fireEvent.keyDown(document.activeElement as HTMLElement, {
    code: "Enter",
    key: "Enter",
    which: 13,
    keyCode: 13,
  });

  expect(onSelectMock).toBeCalledWith({ group: "A", channel: "1" });
});
