import { useState } from "react";
import "./App.css";
import ChannelsList from "./components/ChannelsList/";
import ServersList from "./components/ServersList";
import MessageList from "./components/MessageList"
import MessageBox from "./components/MessageBox"
import { ShortcutProvider } from "./contexts/ShortcutContext/ShortcutContext";

type MessageType = {
  author: string;
  pfp: string;
  timestamp: Date;
  text: string;
}

function App() {
  const [selected, setSelected] = useState({
    group: "Questions",
    channel: "unit-2",
  });

  const [selectedServer, setSelectedServer] = useState({
    group: "FA21",
    server: "PHYS212",
  });

  const [messages, setMessages] = useState<{[key: string]: {[key: string]: Array<MessageType>}}>({
    "PHYS212": {"unit-1": [], "unit-2": [
      {author: "ryan", pfp: "https://cdn.discordapp.com/avatars/328226003753107457/6ffe47f87a3f9ee9e80675167e8ce6e0.png?size=128", timestamp: new Date(), text: "hey guys im ryan :)"},
      {author: "ryan", pfp: "https://cdn.discordapp.com/avatars/328226003753107457/6ffe47f87a3f9ee9e80675167e8ce6e0.png?size=128", timestamp: new Date(), text: "(im not kevin)"}
    ], "unit-3": [], "project-1": [], "project-2": []},
    "CS222": {"announcements": [], "meeting-notes": [], "due-dates": [], "minecraft-mod": [], "universal-chat": []}
  })

  const [servers, setServers] = useState<{[key: string]: {[key: string]: {[key: string]: string[]}}}>({"FA21": {"PHYS212": {"Questions": ["unit-1", "unit-2", "unit-3"], "Groupwork": ["project-1", "project-2"]}, "CS222": {"Information": ["announcements", "due-dates", "meeting-notes"], "Project Discussion": ["minecraft-mod", "universal-chat"]}}})

  const [user, setUser] = useState({username: "kmh", pfp: "https://cdn.discordapp.com/avatars/294245609744105474/f9214f9a2fb2aaa17f6504b989705817.png?size=128"})

  const addMessage = (message : MessageType) => setMessages(state => {return {...state, [selectedServer.server]: {...state[selectedServer.server], [selected.channel]: [...state[selectedServer.server][selected.channel], message]}}})

  return (
    <ShortcutProvider>
      <div style={{ display: "flex", flexDirection: "row", width: "100vw" }}>
        <ServersList
          groups={Object.keys(servers)}
          serversByGroup={Object.keys(servers).reduce<{[key: string]: string[]}>((obj, grp) => {return {...obj, [grp]: Object.keys(servers[grp])}}, {})}
          selected={selectedServer}
          onSelect={(selection) => setSelectedServer(selection)}
        />
        <ChannelsList
          groups={Object.keys(servers[selectedServer.group][selectedServer.server])}
          channelsByGroup={servers[selectedServer.group][selectedServer.server]}
          selected={selected}
          onSelect={(selection) => setSelected(selection)}
          serverName={selectedServer.server}
        />
        <div style={{flexGrow: 1, display: "flex", flexDirection: "column", height: "100vh"}}>
          <MessageList messages={selected.channel in messages[selectedServer.server] ? messages[selectedServer.server][selected.channel] : (() => {let group = Object.keys(servers[selectedServer.group][selectedServer.server])[0]; setSelected({group, channel: servers[selectedServer.group][selectedServer.server][group][0]}); return []})()}></MessageList>
          <MessageBox addMessage={addMessage} user={user}></MessageBox>
        </div>
      </div>
    </ShortcutProvider>
  );
}

export default App;
