import React from "react";
import { Hash } from "react-feather";
import tw from "tailwind-styled-components";
import AccessibleList from "../AccessibleList/";

const Container = tw.div`
  bg-gray-100
  dark:bg-gray-700
  max-w-xs
  h-full
  p-2
  dark:border-gray-700
  border-2
  focus:border-opacity-100
  dark:focus:border-opacity-100
  dark:focus:border-gray-50
  focus:border-gray-800
  min-h-screen
`;

const ServerTitle = tw.h1`
  text-left
  text-bold
  text-2xl
  text-gray-600
  dark:text-gray-300
  mb-2
`;

const GroupContainer = tw.ul`
  list-none
  mb-5
`;

const GroupTitle = tw.li`
  text-left
  text-gray-600
  dark:text-gray-300
  text-base
  uppercase
  mb-2
  ml-3
`;

type ChannelProps = {
  $selected: boolean;
};

const Channel = tw.li<ChannelProps>`
  text-gray-800
  dark:text-gray-50
  flex
  items-center
  py-1
  mb-1
  px-3
  hover:bg-gray-300
  dark:hover:bg-gray-500
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
    props.$selected ? "dark:bg-gray-500 bg-gray-300 font-bold" : ""}
`;

type ItemProps = {
  $selected: boolean;
  selected: boolean;
  item: string;
};
const ItemContainer = React.forwardRef((props: ItemProps, ref) => {
  return (
    <Channel {...props} ref={ref}>
      <Hash
        size={17}
        className="mr-2"
        strokeWidth={props.selected ? 2.5 : 2}
        role="presentation"
        aria-hidden="true"
      />{" "}
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
   * The name of the chat server
   */
  serverName: string;
  /**
   * List of all of the channel groups in this list
   */
  groups: Array<string>;
  /**
   * Map of groups and their channels
   */
  channelsByGroup: { [key: string]: Array<string> };
  /**
   * The user's current selection
   */
  selected: Selection;
  /**
   * Function called when a new channel selection is made
   */
  onSelect: (selection: Selection) => void;
};

/**
 * Displays a list of channels by group and provides facilities for accessible use.
 */
function ChannelsList({
  groups,
  channelsByGroup,
  selected,
  onSelect,
  serverName,
}: Props) {
  return (
    <AccessibleList
      title={serverName}
      sections={groups}
      itemsBySection={channelsByGroup}
      selected={{ item: selected.channel, section: selected.group }}
      onSelect={({ item, section }) => {
        onSelect({ channel: item, group: section });
      }}
      listContainer={Container}
      ulContainer={GroupContainer}
      titleContainer={ServerTitle}
      sectionTitleContainer={GroupTitle}
      itemContainer={ItemContainer}
      getItemName={(i) => i}
    />
  );
}

export default ChannelsList;
