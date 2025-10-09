import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from './Hero';

describe('Hero Component', () => {
  it('renders the main heading', () => {
    render(<Hero />);
    
    const heading = screen.getByText('TerraGuardian');
    expect(heading).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Hero />);
    
    const tagline = screen.getByText(
      'Transform Your Community Into Land Stewards'
    );
    expect(tagline).toBeInTheDocument();
  });

  it('renders the call-to-action buttons', () => {
    render(<Hero />);
    
    const startButton = screen.getByText('Start Your Journey');
    const learnButton = screen.getByText('Learn More');
    
    expect(startButton).toBeInTheDocument();
    expect(learnButton).toBeInTheDocument();
  });

  it('renders the stats section', () => {
    render(<Hero />);
    
    const stats = [
      'Active Guardians',
      'Hectares Restored',
      'Quests Completed',
      'Tons CO₂ Offset'
    ];
    
    stats.forEach(stat => {
      expect(screen.getByText(stat)).toBeInTheDocument();
    });
  });
});