import React from "react";
import tw from "tailwind-styled-components";
import AccessibleList from "../AccessibleList/";

const Container = tw.div`
  bg-gray-700
  dark:bg-gray-100
  w-36
  h-full
  p-2
  border-gray-700
  border-2
  focus:border-opacity-100
  dark:focus:border-opacity-100
  dark:focus:border-gray-50
  focus:border-gray-800
  min-h-screen
`;

const ServersHeader = tw.h1`
  text-left
  text-black
  text-2xl
  font-bold
  text-gray-300
  dark:text-gray-600
  mb-2
`;

const GroupTitle = tw.h1`
  text-left
  text-black
  font-bold
  text-gray-300
  dark:text-gray-600
  mb-2
`;

const GroupContainer = tw.ul`
  list-none
  mb-5
`;

type ServerProps = {
  $selected: boolean;
};

const Channel = tw.li<ServerProps>`
  text-gray-50
  dark:text-gray-800
  flex
  items-center
  py-1
  px-3
  mb-1
  hover:bg-gray-500
  dark:hover:bg-gray-300
  rounded-lg
  cursor-pointer
  border-gray-800
  dark:border-gray-50
  border-2
  focus:border-opacity-100
  dark:focus:border-opacity-100
  border-opacity-0
  dark:border-opacity-0
  focus:outline-none
  ${(props) =>
    props.$selected ? "dark:bg-gray-300 bg-gray-500 font-bold" : ""}
`;

type ItemProps = {
  $selected: boolean;
  selected: boolean;
  item: string;
};
const ItemContainer = React.forwardRef((props: ItemProps, ref) => {
  return (
    <Channel {...props} ref={ref}>
      {props.item}
    </Channel>
  );
});

type Selection = {
  channel: string;
  group: string;
};

type Props = {
  /**
   * List of all of the server groups in this list
   */
  groups: Array<string>;
  /**
   * Map of groups and their servers
   */
  serversByGroup: { [key: string]: Array<string> };
  /**
   * The user's current selection
   */
  selected: Selection;
  /**
   * Function called when a new server selection is made
   */
  onSelect: (selection: Selection) => void;
};

/**
 * Displays a list of channels by group and provides facilities for accessible use.
 */
function ChannelsList({ groups, serversByGroup, selected, onSelect }: Props) {
  return (
    <AccessibleList
      title={"Servers"}
      sections={groups}
      itemsBySection={serversByGroup}
      selected={{ item: selected.channel, section: selected.group }}
      onSelect={({ item, section }) => {
        onSelect({ channel: item, group: section });
      }}
      listContainer={Container}
      ulContainer={GroupContainer}
      titleContainer={ServersHeader}
      sectionTitleContainer={GroupTitle}
      itemContainer={ItemContainer}
      getItemName={(i) => i}
    />
  );
}

export default ChannelsList;
