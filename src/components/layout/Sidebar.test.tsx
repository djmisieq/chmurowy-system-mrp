import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
  it('renders correctly when open', () => {
    // Arrange
    const mockToggle = jest.fn();
    
    // Act
    render(<Sidebar isOpen={true} toggleSidebar={mockToggle} />);
    
    // Assert
    expect(screen.getByText('Chmurowy MRP')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Zamówienia')).toBeInTheDocument();
    expect(screen.getByText('Magazyn')).toBeInTheDocument();
    expect(screen.getByText('Raporty')).toBeInTheDocument();
    expect(screen.getByText('Ustawienia')).toBeInTheDocument();
  });

  it('renders correctly when closed', () => {
    // Arrange
    const mockToggle = jest.fn();
    
    // Act
    render(<Sidebar isOpen={false} toggleSidebar={mockToggle} />);
    
    // Assert
    expect(screen.queryByText('Chmurowy MRP')).not.toBeInTheDocument();
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('calls toggleSidebar when button is clicked', () => {
    // Arrange
    const mockToggle = jest.fn();
    
    // Act
    render(<Sidebar isOpen={true} toggleSidebar={mockToggle} />);
    fireEvent.click(screen.getByRole('button'));
    
    // Assert
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });
});
