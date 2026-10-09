import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl font-bold transition-[color,background-color,border-color,box-shadow,transform] duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:translate-y-px",
  {
    variants: {
      variant: {
        default: "bg-teal text-white shadow-sm shadow-teal/20 hover:bg-[#066d65] hover:shadow-md hover:shadow-teal/20",
        secondary: "bg-amber text-ink shadow-sm shadow-ink/10 hover:bg-[#ffc95d]",
        outline: "border border-ink/15 bg-transparent text-ink hover:border-ink/25 hover:bg-ink/5",
        ghost: "text-ink/65 hover:bg-ink/5 hover:text-ink",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        default: "h-11 px-5 text-sm",
        lg: "h-13 px-6 text-[0.95rem]",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
