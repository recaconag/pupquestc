import { Button, type ButtonProps } from "flowbite-react";
import { cx } from "./cx";
import { ui } from "./tokens";

type Variant = "primary" | "ghost" | "danger";

type Props = Omit<ButtonProps, "color"> & {
  variant?: Variant;
};

export function PupButton({ variant = "primary", className, ...props }: Props) {
  const variantClass =
    variant === "danger"
      ? ui.button.danger
      : variant === "ghost"
        ? ui.button.ghost
        : ui.button.primary;

  return (
    <Button
      {...props}
      className={cx(
        ui.motion,
        ui.focusRing,
        "rounded-lg font-semibold tracking-wide",
        variantClass,
        className
      )}
    />
  );
}

