import { useState } from "react";
import "./App.css";
import ChannelsList from "./components/ChannelsList/";

function App() {
  const [selected, setSelected] = useState({
    group: "Group 1",
    channel: "channel-2",
  });

  return (
    <>
      <ChannelsList
        groups={["Group 1", "Group 2"]}
        channelsByGroup={{
          "Group 1": ["channel-1", "channel-2"],
          "Group 2": ["channel-3", "channel-4"],
        }}
        selected={selected}
        onSelect={(selection) => setSelected(selection)}
        serverName="CS222 Discord"
      />
    </>
  );
}

export default App;
