import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import tw from "tailwind-styled-components";
import AccessibleList from "../AccessibleList";

const Container = tw.div``;

const Title = tw.h1``;

const SectionContainer = tw.ul``;

const GroupTitle = tw.li``;

type ChannelProps = {
  $selected: boolean;
};

const Item = tw.li<ChannelProps>``;

const ItemContainer = React.forwardRef(
  (props: { $selected: boolean; item: string }, ref) => {
    return (
      <Item {...props} ref={ref}>
        {props.item}
      </Item>
    );
  }
);

const displayProps = {
  listContainer: Container,
  ulContainer: SectionContainer,
  titleContainer: Title,
  sectionTitleContainer: GroupTitle,
  itemContainer: ItemContainer,
  getItemName: (i: string) => i,
};

it("uses the title as a label", () => {
  render(
    <AccessibleList
      sections={[]}
      itemsBySection={{}}
      title="The title"
      selected={{ section: "A", item: "1" }}
      onSelect={() => null}
      {...displayProps}
    />
  );

  expect(screen.getByRole("listbox")).toHaveAccessibleName("The title");
  expect(screen.getByText("The title")).toBeInTheDocument();
});

it("lists the section names", () => {
  render(
    <AccessibleList
      sections={["A", "B", "C"]}
      itemsBySection={{ A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] }}
      title="The title"
      selected={{ section: "A", item: "2" }}
      onSelect={() => null}
      {...displayProps}
    />
  );

  const sections = screen.getAllByRole("section");
  expect(sections[0]).toHaveAccessibleName("A");
  expect(sections[1]).toHaveAccessibleName("B");
  expect(sections[2]).toHaveAccessibleName("C");

  // and also make sure these labels are actually shown somewhere in the document
  expect(screen.getByText("A")).toBeInTheDocument();
  expect(screen.getByText("B")).toBeInTheDocument();
  expect(screen.getByText("C")).toBeInTheDocument();
});

it("lists the child names in accessible sections", () => {
  const itemsBySection = { A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] };

  render(
    <AccessibleList
      sections={["A", "B", "C"]}
      itemsBySection={itemsBySection}
      title="The title"
      selected={{ section: "A", item: "2" }}
      onSelect={() => null}
      {...displayProps}
    />
  );

  const section1 = screen.getByLabelText("A");
  const section1Options = within(section1).getAllByRole("option");
  expect(section1Options[0]).toHaveAccessibleName("1");
  expect(section1Options[1]).toHaveAccessibleName("2");
  expect(section1Options[0]).toHaveTextContent("1");
  expect(section1Options[1]).toHaveTextContent("2");

  const section2 = screen.getByLabelText("B");
  const section2Options = within(section2).getAllByRole("option");
  expect(section2Options[0]).toHaveAccessibleName("2");
  expect(section2Options[1]).toHaveAccessibleName("3");
  expect(section2Options[2]).toHaveAccessibleName("4");
  expect(section2Options[0]).toHaveTextContent("2");
  expect(section2Options[1]).toHaveTextContent("3");
  expect(section2Options[2]).toHaveTextContent("4");

  const section3 = screen.getByLabelText("C");
  const section3Options = within(section3).getAllByRole("option");
  expect(section3Options[0]).toHaveAccessibleName("5");
  expect(section3Options[0]).toHaveTextContent("5");
});

it("calls onSelect when a item name is clicked", () => {
  const onSelectMock = jest.fn();

  render(
    <AccessibleList
      sections={["A", "B", "C"]}
      itemsBySection={{ A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] }}
      title="The title"
      selected={{ section: "A", item: "2" }}
      onSelect={onSelectMock}
      {...displayProps}
    />
  );

  screen.getByText("3").click();

  expect(onSelectMock).toBeCalledWith({ section: "B", item: "3" });
});

it("initially focuses the selected item", () => {
  render(
    <AccessibleList
      sections={["A", "B", "C"]}
      itemsBySection={{ A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] }}
      title="The title"
      selected={{ section: "A", item: "2" }}
      onSelect={() => null}
      {...displayProps}
    />
  );

  userEvent.tab(); // going from document to items list
  userEvent.tab(); // going from items list to an individual item

  expect(within(screen.getByLabelText("A")).getByText("2")).toHaveFocus();
});

it("moves focus up when the up arrow is pressed", () => {
  render(
    <AccessibleList
      sections={["A", "B", "C"]}
      itemsBySection={{ A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] }}
      title="The title"
      selected={{ section: "A", item: "2" }}
      onSelect={() => null}
      {...displayProps}
    />
  );

  userEvent.tab(); // going from document to items list
  userEvent.tab(); // going from items list to an individual item

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
    <AccessibleList
      sections={["A", "B", "C"]}
      itemsBySection={{ A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] }}
      title="The title"
      selected={{ section: "A", item: "2" }}
      onSelect={() => null}
      {...displayProps}
    />
  );

  userEvent.tab(); // going from document to items list
  userEvent.tab(); // going from items list to an individual item

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

it("selects a item when right arrow is pressed", () => {
  const onSelectMock = jest.fn();

  render(
    <AccessibleList
      sections={["A", "B", "C"]}
      itemsBySection={{ A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] }}
      title="The title"
      selected={{ section: "A", item: "2" }}
      onSelect={onSelectMock}
      {...displayProps}
    />
  );

  userEvent.tab(); // going from document to items list
  userEvent.tab(); // going from items list to an individual item

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

  expect(onSelectMock).toBeCalledWith({ section: "A", item: "1" });
});

it("selects a item when enter is pressed", () => {
  const onSelectMock = jest.fn();

  render(
    <AccessibleList
      sections={["A", "B", "C"]}
      itemsBySection={{ A: ["1", "2"], B: ["2", "3", "4"], C: ["5"] }}
      title="The title"
      selected={{ section: "A", item: "2" }}
      onSelect={onSelectMock}
      {...displayProps}
    />
  );

  userEvent.tab(); // going from document to items list
  userEvent.tab(); // going from items list to an individual item

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

  expect(onSelectMock).toBeCalledWith({ section: "A", item: "1" });
});
