import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from '../components/NotFound';

// Define a test case for the NotFound component
test('renders 404 message', () => {
  // Render the NotFound component
  render(<NotFound />);

  // Check if the "404" text is rendered
  expect(screen.getByText('404')).toBeInTheDocument();

  // Check if the "Look like you're lost" text is rendered
  expect(screen.getByText("Look like you're lost")).toBeInTheDocument();

  // Check if the "the page you are looking for not available!" text is rendered
  expect(screen.getByText('the page you are looking for is not available!')).toBeInTheDocument();

  // Check if the "Home" link has the correct href attribute
  expect(screen.getByText('Home')).toHaveAttribute('href', '/');
});