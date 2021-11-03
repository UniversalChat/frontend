import React from 'react';
import { render, screen } from '@testing-library/react';
import SignIn from './SignIn';

test('renders sign in with slack', () => {
  render(<SignIn />);
  const linkElement = screen.getByText(/Sign In With Slack/);
  expect(linkElement).toBeInTheDocument();
});
