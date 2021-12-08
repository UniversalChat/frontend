import tw from "tailwind-styled-components";
import Message from "../Message";

type MessageType = {
  author: string;
  pfp: string;
  timestamp: Date;
  text: string;
}

type Props = {
  messages: Array<MessageType>;
}  

const List = tw.ul`
  flex-grow
  flex
  flex-col
  justify-end
  overflow-y-auto
`

const MessageItem = tw.li``

function MessageList({messages} : Props) {
  return (
    <List>
      {messages.map(m => <MessageItem><Message author={m.author} pfp={m.pfp} timestamp={m.timestamp} text={m.text}></Message></MessageItem>)}
    </List>
  )
}

export default MessageList
