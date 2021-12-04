import { useState } from "react";
import "./App.css";
import ChannelsList from "./components/ChannelsList/";
import ServersList from "./components/ServersList";
import { ShortcutProvider } from "./contexts/ShortcutContext/ShortcutContext";

function App() {
  const [selected, setSelected] = useState({
    group: "Group 1",
    channel: "channel-2",
  });

  const [selectedServer, setSelectedServer] = useState({
    group: "FA21",
    channel: "PHYS212",
  });

  return (
    <ShortcutProvider>
      <div style={{ display: "flex", flexDirection: "row", width: "100vw" }}>
        <ServersList
          groups={["FA21"]}
          serversByGroup={{
            FA21: ["PHYS212", "CS222"],
          }}
          selected={selectedServer}
          onSelect={(selection) => setSelectedServer(selection)}
        />
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
      </div>
    </ShortcutProvider>
  );
}

export default App;
