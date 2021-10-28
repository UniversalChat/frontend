import { useRef, Fragment } from "react";
import { Hash } from "react-feather";
import tw from "tailwind-styled-components";

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

type Selection = {
  channel: string;
  group: string;
};

type ChannelInstance = {
  channelName: string;
  groupName: string;
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
  // We need to uniquely identify the header element so that we can indicate
  // for screen readers that it labels the list of channels
  const titleId = serverName.replaceAll(" ", "") + "-label";

  // We store a map of the form {groupName: {channelName: <element>}}
  // so that we can programmatically bring screen reader focus to
  // an arbitrary channel. This is initially empty and is populated by
  // calls to `setElementRef`. We use a map {channelName: <element>} instead
  // of an array [<element>] because it makes it simpler to deal with the case
  // of props being updated and adding a channel in the middle of a group
  // for exampe {a: [1,2,3]} -> {a: [1,0,2,3]}.
  const channelElements = useRef<{
    [key: string]: { [key: string]: HTMLLIElement };
  }>({});

  /**
   * Updates the stored reference to the HTML element for the `channelName` in `groupName`
   * @param groupName the name of the group
   * @param channelName the name of the channel
   * @param element reference to the HTML element
   */
  const setElementRef = (
    { channelName, groupName }: ChannelInstance,
    element: HTMLLIElement
  ) => {
    if (!(groupName in channelElements.current)) {
      channelElements.current[groupName] = {};
    }
    channelElements.current[groupName][channelName] = element;
  };

  /**
   * Manages keypress actions for behavior specific to this component. On up
   * and down arrow key presses, updates the focus of channels in the sidebar,
   * and on a right arrow keypress selects a channel.
   */
  const handleKeydown = (
    { channelName, groupName }: ChannelInstance,
    event: React.KeyboardEvent<HTMLLIElement>
  ) => {
    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
      const channelsInGroup = channelsByGroup[groupName];
      const currentGroupIndex = groups.indexOf(groupName);
      const currentChannelIndex = channelsInGroup.indexOf(channelName);

      let nextGroupName = groupName;
      let nextChannelIndex = currentChannelIndex;

      if (event.code === "ArrowUp") {
        if (currentChannelIndex - 1 >= 0) {
          nextChannelIndex = currentChannelIndex - 1;
        } else {
          if (currentGroupIndex === 0) {
            nextGroupName = groups[groups.length - 1];
          } else {
            nextGroupName = groups[currentGroupIndex - 1];
          }
          nextChannelIndex = channelsByGroup[nextGroupName].length - 1;
        }
      }

      if (event.code === "ArrowDown") {
        if (currentChannelIndex + 1 < channelsInGroup.length) {
          nextChannelIndex = currentChannelIndex + 1;
        } else {
          if (currentGroupIndex + 1 >= Object.keys(channelsByGroup).length) {
            nextGroupName = groups[0];
          } else {
            nextGroupName = groups[currentGroupIndex + 1];
          }
          nextChannelIndex = 0;
        }
      }

      const nextChannelName = channelsByGroup[nextGroupName][nextChannelIndex];
      channelElements.current[nextGroupName][nextChannelName].focus();
      event.stopPropagation();
    }

    if (event.code === "ArrowRight") {
      // Select this
      onSelect({ group: groupName, channel: channelName });
      event.stopPropagation();
    }
  };

  return (
    <Container role="listbox" tabIndex={0} aria-labelledby={titleId}>
      <ServerTitle id={titleId} role="presentation">
        {serverName}
      </ServerTitle>
      {groups.map((groupName) => {
        const groupChannels = channelsByGroup[groupName];
        const groupId = groupName.replaceAll(" ", "");
        return (
          <Fragment key={groupName}>
            <GroupContainer role="group" aria-label={groupName}>
              <GroupTitle id={groupId} role="presentation">
                {groupName}
              </GroupTitle>
              {groupChannels.map((channelName) => {
                const channelSelected =
                  groupName === selected.group &&
                  channelName === selected.channel;
                return (
                  <Channel
                    $selected={channelSelected}
                    id={`${groupId}-${channelName}`}
                    role="option"
                    aria-selected={channelSelected}
                    tabIndex={channelSelected ? 0 : -1}
                    onKeyDown={(event) =>
                      handleKeydown({ groupName, channelName }, event)
                    }
                    ref={(ref) =>
                      setElementRef(
                        { groupName, channelName },
                        ref as HTMLLIElement
                      )
                    }
                    onClick={() =>
                      onSelect({ group: groupName, channel: channelName })
                    }
                    key={channelName + groupName}
                  >
                    <Hash
                      size={17}
                      className="mr-2"
                      strokeWidth={channelSelected ? 2.5 : 2}
                      role="presentation"
                      aria-hidden="true"
                    />{" "}
                    {channelName}
                  </Channel>
                );
              })}
            </GroupContainer>
          </Fragment>
        );
        Object.keys(channelsByGroup);
      })}
    </Container>
  );
}

export default ChannelsList;
