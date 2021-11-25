import React, {
  AriaRole,
  ComponentType,
  Fragment,
  ReactNode,
  useRef,
} from "react";

type Selection<T> = {
  section: string;
  item: T;
};

type ItemInstance = {
  sectionName: string;
  itemName: string;
};

type Props<T> = {
  /**
   * The title of the list
   */
  title: string;
  /**
   * Section headings for the list
   */
  sections: Array<string>;
  /**
   * Map of each section name to the items within it
   */
  itemsBySection: { [key: string]: Array<T> };
  /**
   * The selected section/item
   */
  selected: Selection<T>;
  /**
   * Function called when an item is selected
   */
  onSelect: (selection: Selection<T>) => void;
  /**
   * A `div` that is used to contain the accessible list
   */
  listContainer: ComponentType<{
    children: ReactNode;
    role: AriaRole | undefined;
    tabIndex: number | undefined;
  }>;
  /**
   * A `ul` that is used to contain all of the items
   * in each section
   */
  ulContainer: ComponentType<{
    children: ReactNode;
    role: AriaRole | undefined;
  }>;
  /**
   * A heading component that wraps the title of the list
   */
  titleContainer: ComponentType<{
    children: ReactNode;
    id: string | undefined;
    role: AriaRole | undefined;
  }>;
  /**
   * An `li` that displays the title for a given section
   */
  sectionTitleContainer: ComponentType<{
    children: ReactNode;
    id: string | undefined;
  }>;
  /**
   * An `li` that displays a given item
   */
  itemContainer: ComponentType<{
    item: T;
    selected: boolean;
    $selected: boolean;
    id: string;
    role: AriaRole | null | undefined;
    tabIndex: number | null | undefined;
    onKeyDown: (event: React.KeyboardEvent<HTMLLIElement>) => void;
    ref: React.Ref<unknown>;
    onClick: () => void;
  }>;
  /**
   * Return a section-unique name for the provided item
   */
  getItemName: (item: T) => string;
};
/**
 * Creates a keyboard-nagivatable, screen-reader accessible
 * list from the provided sections and items.
 */
function AccessibleList<T>({
  title,
  sections,
  itemsBySection,
  selected,
  onSelect,
  listContainer: ListContainer,
  ulContainer: UlContainer,
  titleContainer: TitleContainer,
  sectionTitleContainer: SectionTitleContainer,
  itemContainer: ItemContainer,
  getItemName,
}: Props<T>) {
  // We store a map of the form {sectionName: {itemName: <element>}}
  // so that we can programmatically bring screen reader focus to
  // an arbitrary item. This is initially empty and is populated by
  // calls to `setElementRef`. We use a map {itemName: <element>} instead
  // of an array [<element>] because it makes it simpler to deal with the case
  // of props being updated and adding a item in the middle of a section
  // for exampe {a: [1,2,3]} -> {a: [1,0,2,3]}.
  const itemElements = useRef<{
    [key: string]: { [key: string]: HTMLLIElement };
  }>({});

  /**
   * Updates the stored reference to the HTML element for the `itemName` in `sectionName`
   * @param sectionName the name of the section
   * @param itemName the name of the item
   * @param element reference to the HTML element
   */
  const setElementRef = (
    { itemName, sectionName }: ItemInstance,
    element: HTMLLIElement
  ) => {
    if (!(sectionName in itemElements.current)) {
      itemElements.current[sectionName] = {};
    }
    itemElements.current[sectionName][itemName] = element;
  };

  /**
   * Manages keypress actions for behavior specific to this component. On up
   * and down arrow key presses, updates the focus of items in the sidebar,
   * and on a right arrow keypress selects a item.
   */
  const handleKeydown = (
    { item, sectionName }: { item: T; sectionName: string },
    event: React.KeyboardEvent<HTMLLIElement>
  ) => {
    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
      const itemsInSection = itemsBySection[sectionName];
      const currentSectionIndex = sections.indexOf(sectionName);
      const currentItemIndex = itemsInSection.indexOf(item);

      let nextSectionName = sectionName;
      let nextItemIndex = currentItemIndex;

      if (event.code === "ArrowUp") {
        if (currentItemIndex - 1 >= 0) {
          nextItemIndex = currentItemIndex - 1;
        } else {
          if (currentSectionIndex === 0) {
            nextSectionName = sections[sections.length - 1];
          } else {
            nextSectionName = sections[currentSectionIndex - 1];
          }
          nextItemIndex = itemsBySection[nextSectionName].length - 1;
        }
      }

      if (event.code === "ArrowDown") {
        if (currentItemIndex + 1 < itemsInSection.length) {
          nextItemIndex = currentItemIndex + 1;
        } else {
          if (currentSectionIndex + 1 >= sections.length) {
            nextSectionName = sections[0];
          } else {
            nextSectionName = sections[currentSectionIndex + 1];
          }
          nextItemIndex = 0;
        }
      }

      const nextItem = itemsBySection[nextSectionName][nextItemIndex];
      itemElements.current[nextSectionName][getItemName(nextItem)].focus();
      event.stopPropagation();
    }

    if (event.code === "ArrowRight" || event.code === "Enter") {
      // Select this
      onSelect({ section: sectionName, item: item });
      event.stopPropagation();
    }
  };

  const titleId = title.replaceAll(" ", "_");

  return (
    <ListContainer role="listbox" tabIndex={0} aria-labelledby={titleId}>
      <TitleContainer id={titleId} role="presentation">
        {title}
      </TitleContainer>
      {sections.map((section) => {
        if (!(section in itemElements.current)) {
          itemElements.current[section] = {};
        }
        const sectionId = section.replaceAll(" ", "_");
        return (
          <Fragment key={section}>
            <UlContainer role="section" aria-label={section}>
              <SectionTitleContainer id={sectionId}>
                {section}
              </SectionTitleContainer>
              {itemsBySection[section].map((item) => {
                const itemSelected =
                  section === selected.section && item === selected.item;
                if (itemSelected) {
                  console.log("item " + item + " is selected");
                }
                const itemId = getItemName(item).replaceAll(" ", "_");
                return (
                  <ItemContainer
                    selected={itemSelected}
                    id={`${sectionId}-${itemId}`}
                    $selected={itemSelected}
                    role="option"
                    aria-selected={itemSelected}
                    tabIndex={itemSelected ? 0 : -1}
                    item={item}
                    onKeyDown={(event: React.KeyboardEvent<HTMLLIElement>) =>
                      handleKeydown({ item, sectionName: section }, event)
                    }
                    ref={(ref: any) => {
                      console.log("set element ref");
                      setElementRef(
                        { itemName: getItemName(item), sectionName: section },
                        ref as HTMLLIElement
                      );
                    }}
                    onClick={() => onSelect({ section, item })}
                    key={getItemName(item) + sectionId}
                  />
                );
              })}
            </UlContainer>
          </Fragment>
        );
      })}
    </ListContainer>
  );
}

export default AccessibleList;
