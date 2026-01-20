// Button.tsx
import React from 'react';
import './Button.css';
import { FiArrowLeft } from 'react-icons/fi';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'action' | 'back' | 'accept' | 'cancel';
type ButtonSize = 'small' | 'medium' | 'large' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'medium',
  children, 
  icon,
  className = '',
  ...props 
}) => {
  const classes = `game-button game-button--${variant} game-button--${size} ${className}`;

  return (
    <button className={classes} {...props}>
      {icon && size === 'icon' ? icon : (
        <span className="game-button__content">
          {icon}
          {children}
        </span>
      )}
    </button>
  );
};

export const BackButton: React.FC<Omit<ButtonProps, 'variant' | 'icon'>> = (props) => (
  <Button 
  variant="back" 
  icon={<FiArrowLeft size={28} />}
  {...props}
  >
    {props.children }
  </Button>
);

export const IconButton: React.FC<{ 
  variant: 'accept' | 'cancel'; 
  icon: React.ReactNode; 
  onClick?: () => void;
  className?: string;
}> = ({ variant, icon, onClick, className = '' }) => (
  <Button variant={variant} size="icon" onClick={onClick} className={className}>
    {icon}
  </Button>
);