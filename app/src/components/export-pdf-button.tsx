import React, { RefObject, useCallback, useRef } from "react";
import clsx from "clsx";
import { Button, ButtonProps } from "./ui/button";
import { useReactToPrint } from "react-to-print";
import { Icons } from "./icons";

type ExportPdfButtonProps = {
  elementRef: RefObject<HTMLElement>;
  className?: string;
  filename?: string;
  buttonText?: string;
  variant?: string;
  size?: string;
} & ButtonProps;

const ExportPdfButton: React.FC<ExportPdfButtonProps> = ({
  elementRef,
  className,
  filename = "download",
  buttonText = "Print",
  variant = "outline",
  size = "sm",
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePrint = useReactToPrint({
    content: () => elementRef.current,
    documentTitle: filename,
    onAfterPrint: () => {
      if (buttonRef.current) {
        buttonRef.current.style.display = "";
      }
    },
  });

  const exportToPdf = useCallback(() => {
    if (!elementRef.current) {
      console.error("Element reference is not provided or invalid.");
      return;
    }

    if (buttonRef.current) {
      buttonRef.current.style.display = "none";
    }

    handlePrint();
  }, [elementRef, handlePrint]);

  return (
    <Button
      ref={buttonRef}
      className={clsx("h-8 gap-1", className)}
      onClick={exportToPdf}
      variant={variant}
      size={size}
    >
      <Icons.printer className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only">{buttonText}</span>
    </Button>
  );
};

export default ExportPdfButton;
