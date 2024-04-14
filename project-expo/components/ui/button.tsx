import {
  Button as GButton,
  ButtonText,
  ButtonSpinner,
} from "@gluestack-ui/themed";
import { ComponentProps } from "react";

type IButtonProps = ComponentProps<typeof GButton>;

// Props extended from gluestack-ui Button
interface ButtonProps extends IButtonProps {
  text: string;
  loading: boolean;
}

/**
 * Custom Button component with built in loading state.
 *
 * Extends gluestack-ui Button.
 *
 * @param text - The text to display on the button
 * @param loading - Whether the button is in a loading state
 *
 */
export default function Button({ text, loading, ...props }: ButtonProps) {
  return (
    <GButton {...props} isDisabled={loading}>
      {loading ? <ButtonSpinner /> : <ButtonText>{text}</ButtonText>}
    </GButton>
  );
}
