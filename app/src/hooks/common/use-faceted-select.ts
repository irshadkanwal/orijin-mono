import { useCallback, useEffect, useState } from "react";

export function useFacetedSelect({
  handleChange: handleChange,
  values: initialValues,
}: {
  values?: string[];
  handleChange: (values: string[]) => void;
}) {
  const [selectedValues, setSelectedValues] = useState(new Set(initialValues));

  const toggleOption = useCallback(
    (value: string) => {
      const newSelectedValues = new Set(selectedValues);
      selectedValues.has(value)
        ? newSelectedValues.delete(value)
        : newSelectedValues.add(value);

      const values = Array.from(newSelectedValues);
      handleChange(values);
      setSelectedValues(newSelectedValues);
    },
    [handleChange, selectedValues]
  );

  const clearValues = useCallback(() => {
    setSelectedValues(new Set());
    handleChange([]);
  }, [handleChange]);

  useEffect(() => {
    setSelectedValues(new Set(initialValues));
  }, [initialValues]);

  return {
    toggleOption,
    clearValues,
    selectedValues,
  };
}
