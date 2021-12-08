import tw from "tailwind-styled-components";

const Box = tw.input`
  rounded-md
  bg-gray-200
  outline-none
  w-full
  px-4
  py-4
`

const Wrapper = tw.form`
  w-full
  px-4
  pb-4
  pt-2
`

function MessageBox({addMessage, user} : {addMessage: Function; user: {username: string; pfp: string}}) {
  return (<Wrapper onSubmit={event => {event.preventDefault(); let input = ((event.target as HTMLFormElement).elements.namedItem('message') as HTMLInputElement); addMessage({text: input.value, author: user.username, pfp: user.pfp, timestamp: new Date()}); input.value = ''}}><Box autoComplete="off" placeholder="Enter message" name="message"></Box></Wrapper>)
}

export default MessageBox
