import tw from "tailwind-styled-components";

const ProfilePicture = tw.img`
  rounded-full
  h-full
  p-3
  ml-1
`

const Byline = tw.h3`
  text-left
  text-black
  font-bold
  dark:text-gray-600
  my-2
`

const Timestamp = tw.span`
  text-left
  text-gray-400
  my-2
  mx-2
  font-normal
`

const MessageText = tw.p``

const MessageRight = tw.div`
  flex
  flex-col
`

const MessageContainer = tw.div`
  h-20
  flex
  flex-row
`

type Props = {
  author: string;
  pfp: string;
  timestamp: Date;
  text: string;
}

function Message({author, pfp, timestamp, text} : Props) {
  return (
    <MessageContainer>
      <ProfilePicture src={pfp}></ProfilePicture>
      <MessageRight>
        <Byline>{author} <Timestamp>{timestamp.toLocaleString()}</Timestamp></Byline>
        <MessageText>{text}</MessageText>
      </MessageRight>
    </MessageContainer>
  )
}

export default Message
