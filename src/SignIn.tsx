import { Fragment } from "react";
import tw from "tailwind-styled-components";

const Header = tw.h1`
my-8
mx-3
text-center
text-4xl
`;

const Buttons = tw.div`text-center`

const Button = tw.a`
my-3
mx-3
text-lg
text-center
p-3
bg-yellow-500
text-white
rounded-md
`

function SignIn() {
    return (
        <Fragment>
            <Header>Universal Chat</Header>
            <Buttons><Button href="https://kevinhiggs.com">Sign In With Slack</Button></Buttons>
        </Fragment>
    )
}

export default SignIn;