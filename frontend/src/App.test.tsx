import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders all top bar links and image', () => {
  render(<BrowserRouter><App /></BrowserRouter>);
  
  const mainLogo = screen.getByTestId("logo");
  expect(mainLogo).toBeInTheDocument();

  //  =note we don't need to check for these since they are hidden
  //  =until user logs in
  // const linkCompareElement = screen.getByText(/Compare/i);
  // const linkSignOutElement = screen.getByText(/Sign Out/i);
  // expect(linkSignOutElement).toBeInTheDocument();
  // expect(linkCompareElement).toBeInTheDocument();
});
