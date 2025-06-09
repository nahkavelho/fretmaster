import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable, Text, StyleProp, ViewStyle } from 'react-native';
import { TextClassContext } from '~/components/ui/text';
import { cn } from '~/lib/utils';

const buttonVariants = cva(
  'group flex items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary active:opacity-90',
        destructive: 'bg-destructive active:opacity-90',
        outline:
          'border border-input bg-background active:bg-accent',
        secondary: 'bg-secondary active:opacity-80',
        ghost: 'active:bg-accent',
        link: '', // Link variant might need specific native handling or be removed if not used
      },
      size: {
        default: 'h-10 px-4 py-2 native:h-12 native:px-5 native:py-3',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8 native:h-14',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva(
  'text-sm native:text-base font-medium text-foreground',
  {
    variants: {
      variant: {
        default: 'text-primary-foreground',
        destructive: 'text-destructive-foreground',
        outline: 'group-active:text-accent-foreground',
        secondary: 'text-secondary-foreground group-active:text-secondary-foreground',
        ghost: 'group-active:text-accent-foreground',
        link: 'text-primary',
      },
      size: {
        default: '',
        sm: '',
        lg: 'native:text-lg',
        icon: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ComponentPropsWithoutRef<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

import { ThemeContext } from '../../app/ThemeContext';

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, variant, size, children, style, ...props }, ref) => {
    const { themeName, palette } = React.useContext(ThemeContext);

    let bgColor, borderColor, textColor;

    // Base styling from palette
    bgColor = palette.button;
    textColor = palette.buttonText;
    borderColor = palette.primary; // Default border to primary

    // Theme-specific overrides if necessary (Rocksmith example)
    if (themeName === 'rocksmith') {
      // Rocksmith uses its specific button colors, primary for border is already set
      bgColor = palette.button; // e.g., '#555'
      borderColor = palette.primary; // Now '#FFD900' (Yellow)
      textColor = palette.buttonText; // e.g., '#FFF'
    } else if (themeName === 'dark') {
      // Dark theme might use textSecondary or a specific border color for default buttons
      borderColor = palette.textSecondary; // Example: using textSecondary for border
    } else {
      // Light theme might use text or a specific border color
      borderColor = palette.text; // Example: using text for border
    }

    // Destructive variant overrides
    if (variant === 'destructive') {
      bgColor = palette.notification; // Use notification color for background
      borderColor = palette.notification; // And for border
      // Destructive text color is often white or a high-contrast color defined in palette
      // For simplicity, let's assume destructive buttons always have white text or it's handled by palette.buttonText on a destructive-specific button color
      textColor = '#FFFFFF'; // Or palette.destructiveButtonText if we add it
    }
    return (
      <Pressable
        ref={ref}
        role='button'
        style={[
          {
            backgroundColor: bgColor,
            borderColor: borderColor,
            borderWidth: 2,
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 24,
            alignItems: 'center' as const,
            opacity: props.disabled ? 0.5 : 1,
          },
          style,
        ] as StyleProp<ViewStyle>}
        {...props}
      >
        {typeof children === 'string' ? (
          <Text style={{ color: textColor, fontWeight: 'bold', fontSize: 18 }}>{children}</Text>
        ) : children}
      </Pressable>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };

export default Button;
