import React from "react";
import { Button as CVButton } from "flowbite-react";

// Extend Flowbite’s Button props to include an optional "as" prop.
// The "as" prop allows you to choose the underlying HTML element.
// By default we use "button", but if you need to avoid nested <button> issues,
// you can set it to another element (e.g. "div" or "a").
export interface CVButtonProps extends React.ComponentProps<typeof CVButton> {
  as?: keyof JSX.IntrinsicElements;
}

const CustomCVButton: React.FC<CVButtonProps> = ({
  as: Component = "button",
  children,
  onClick,
  className,
  ...rest
}) => {
  // If we are rendering as a native "button", just use Flowbite's Button
  if (Component === "button") {
    return (
      <CVButton onClick={onClick} className={className} {...rest}>
        {children}
      </CVButton>
    );
  }
  // Otherwise, render the chosen element with Flowbite styling and button-like accessibility.
  return (
    <Component
      onClick={onClick}
      className={className}
      role="button"
      tabIndex={0}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default CustomCVButton;
