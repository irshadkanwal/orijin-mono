import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button, buttonVariants } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from "../ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import {
  FieldProperty,
  FieldType,
  FormError,
  FormFields,
  IFormProps,
} from "@/types/custom-form";
import { z } from "zod";
import { Icons } from "../icons";
import { cloneElement, useCallback, useEffect, useRef, useState } from "react";
import { LocationDropdown } from "../locations/location-dropdown";
import { Checkbox } from "../ui/checkbox";

export function Form({
  formFields: initialFormFields,
  isLoading,
  onSubmit,
  data,
  customForm,
}: IFormProps): JSX.Element {
  const [formFields, setFormFields] = useState<FormFields[]>(initialFormFields);
  const createSchemaFromFields = (fields: FormFields[]) => {
    const schemaShape: any = {};
    fields.forEach((field) => {
      let baseSchema: any;

      switch (field.property) {
        case FieldProperty.INPUT:
          if (field.type === FieldType.NUMBER) {
            baseSchema = z.preprocess(
              (arg) => {
                if (typeof arg === "string" || typeof arg === "number") {
                  return Number(arg);
                }
                return arg;
              },
              z.number().refine((value) => !isNaN(value), {
                message: `${field.label} is required`,
              })
            );
          } else {
            baseSchema = z.string();
          }
          break;
        case FieldProperty.TEXTAREA:
        case FieldProperty.SELECT:
        case FieldProperty.LOCATION_DROPDOWN:
          baseSchema = z.string();
          break;
        case FieldProperty.DATE_PICKER:
          baseSchema = z.preprocess(
            (arg) => {
              if (typeof arg === "string" || arg instanceof Date) {
                const date = new Date(arg);
                if (!isNaN(date.getTime())) {
                  return date;
                }
              }
              return null;
            },
            z
              .date()
              .nullable()
              .refine((date) => date !== null || date !== undefined, {
                message: `${field.label} is required`,
              })
              .refine((date) => date === null || !isNaN(date.getTime()), {
                message: `${field.label} must be a valid date`,
              })
          );
          break;
        case FieldProperty.MULTI_SELECT:
          baseSchema = z.array(z.string());
          break;
        case FieldProperty.CHECKBOX:
          baseSchema = z.boolean();
          break;
        default:
          return;
      }

      field.errors.forEach((error) => {
        switch (error) {
          case FormError.REQUIRED:
            if (field.property === FieldProperty.MULTI_SELECT) {
              baseSchema = baseSchema.min(1, `${field.label} is required`);
            } else if (field.property === FieldProperty.DATE_PICKER) {
              baseSchema = baseSchema.refine(
                (value: any) => value !== undefined && value !== null,
                {
                  message: `${field.label} is required`,
                }
              );
            } else if (field.property === FieldProperty.CHECKBOX) {
              baseSchema = baseSchema.refine(
                (value: any) => value !== undefined && value !== null,
                {
                  message: `${field.label} is required`,
                }
              );
            } else {
              baseSchema = baseSchema.nonempty(`${field.label} is required`);
            }
            break;
          case FormError.EMAIL:
            baseSchema = baseSchema.email(
              `${field.label} must be a valid email`
            );
            break;
          case FormError.MIN:
            baseSchema = baseSchema.min(
              1,
              `${field.label} must be at least 1 character long`
            );
            break;
          case FormError.MAX:
            baseSchema = baseSchema.max(
              255,
              `${field.label} must be at most 255 characters long`
            );
            break;
          case FormError.NUMBER:
            baseSchema = baseSchema
              .refine(
                (value: any) =>
                  value !== undefined && value !== null && !isNaN(value),
                {
                  message: `${field.label} is required`,
                }
              )
              .refine((value: number) => value >= 1, {
                message: "The number must be at least 1",
              });
            break;
          case FormError.PASSWORD:
            baseSchema = z
              .string()
              .min(8, "Password must be at least 8 characters long")
              .regex(
                /[A-Z]/,
                "Password must contain at least one uppercase letter"
              )
              .regex(/[0-9]/, "Password must contain at least one number")
              .regex(
                /[^A-Za-z0-9]/,
                "Password must contain at least one symbol"
              );
            break;
          case FormError.CONFIRM_PASSWORD:
            if (field.confirmPassId) {
              baseSchema = z
                .string()
                .refine((value: string) => value === field.defaultValue, {
                  message: `${field.label} not matched`,
                });
            }
            break;
          default:
            break;
        }
      });
      if (field.defaultValue !== undefined && field.defaultValue !== null) {
        baseSchema = baseSchema.default(() => field.defaultValue);
      }

      schemaShape[field.id] = baseSchema;
    });
    return z.object(schemaShape);
  };
  const dynamicSchema = createSchemaFromFields(formFields);
  type FormData = z.infer<typeof dynamicSchema>;
  const defaultValues = formFields.reduce(
    (acc, field) => {
      if (field.property === FieldProperty.MULTI_SELECT) {
        acc[field.id] = field.defaultValue || [];
      } else if (field.property === FieldProperty.SELECT) {
        acc[field.id] = Array.isArray(field.defaultValue)
          ? field.defaultValue[0]
          : field.defaultValue || "";
      } else if (field.property === FieldProperty.CHECKBOX) {
        acc[field.id] = field.defaultValue || false;
      } else {
        acc[field.id] = field.defaultValue || "";
      }
      return acc;
    },
    {} as Record<string, any>
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    clearErrors,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(dynamicSchema),
    defaultValues: defaultValues,
  });

  const customFormRef = useRef<{ submit: () => Promise<any> } | null>(null);

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key, data[key] == null ? "" : data[key]);
      });
    }
  }, [data]);

  const watchedValues = useWatch({ control });

  const checkCondition = useCallback(
    (field: FormFields): boolean => {
      if (field.condition) {
        const { field: conditionField, values } = field.condition;
        const status =
          typeof watch(field.id) === "string"
            ? watch(field.id) !== ""
            : watch(field.id).length > 0 ?? false;
        return (
          (watchedValues[conditionField] &&
            values.includes(watchedValues[conditionField])) ||
          status
        );
      }
      return true;
    },
    [watchedValues]
  );

  useEffect(() => {
    formFields.forEach((formField) => {
      if (formField.condition) {
        if (!checkCondition(formField)) {
          setFormFields((formFields) => {
            return formFields.map((field) => {
              if (field.id === formField.id) {
                return {
                  ...field,
                  errors: [], // Clear errors
                };
              }
              return field;
            });
          });
        } else {
          setFormFields((formFields) => {
            return formFields.map((field) => {
              if (field.id === formField.id) {
                return {
                  ...field,
                  errors: field.errors || formField.errors || [],
                };
              }
              return field;
            });
          });
        }
      }
    });
  }, [checkCondition]);

  const filteredFormFields = formFields.filter((field) =>
    checkCondition(field)
  );

  const onSubmitHandler = async (data: any) => {
    if (customFormRef.current) {
      const formData = await customFormRef.current.submit();
      if (formData) {
        const formPayload = { ...formData, ...data };
        onSubmit(formPayload);
      }
    } else {
      onSubmit(data);
    }
  };

  const renderField = (field: FormFields) => {
    let error = errors && errors[field.id];
    const errorText = error?.message ? (error.message as string) : "";
    const watchedValue = watch(field.id);
    const handleMultiSelectChange = (selectedValues: string[]) => {
      const selectedIds = selectedValues
        .map(
          (value) => field.list?.find((item) => item.name === value)?.id || ""
        )
        .filter(Boolean);
      setValue(field.id, selectedIds);
      clearErrors(field.id);
    };

    const getSelectedNames = () => {
      return watchedValue
        .map(
          (id: string) => field.list?.find((item) => item.id === id)?.name || ""
        )
        .filter(Boolean);
    };

    const getFilteredList = () => {
      if (!field.filterFieldId) return field.list;
      const filterValue = watch(field.filterFieldId);
      if (!filterValue || filterValue?.length === 0) {
        field.isDisabled = true;
        return field.list;
      }
      field.isDisabled = false;
      const list =
        field.list?.filter((item: any) => {
          const fieldValue = item[field.filterFieldId as string];

          // If filterValue is an array, check if fieldValue is included in the array
          if (Array.isArray(filterValue)) {
            return filterValue.includes(fieldValue);
          }

          // Otherwise, compare filterValue directly
          return fieldValue === filterValue;
        }) || [];

      return list;
    };
    getFilteredList();

    const setDefaultValueConfirmPassword = () => {
      if (field.confirmPassId && field.type === FieldType.PASSWORD) {
        const password = watch(field.confirmPassId);
        field.defaultValue = password;
      }
    };
    setDefaultValueConfirmPassword();
    switch (field.property) {
      case FieldProperty.INPUT:
        return (
          <div className="grid gap-2">
            <Label className="capitalize" htmlFor={field.id}>
              {field.label}
            </Label>
            <Input
              id={field.id}
              placeholder={field.placeholder}
              type={field.type}
              autoCorrect="off"
              disabled={isLoading || field.isDisabled}
              {...register(field.id)}
            />
            {errorText && errorText !== "" && (
              <p className="px-1 text-xs text-red-600">{errorText}</p>
            )}
          </div>
        );
      case FieldProperty.SELECT:
        return (
          <div className="grid gap-2">
            <Label className="capitalize" htmlFor={field.id}>
              {field.label}
            </Label>
            <Select
              onValueChange={(value) => {
                setValue(field.id, value);
                clearErrors(field.id); // Clear error on value change
              }}
              value={
                Array.isArray(watchedValue)
                  ? watchedValue[0]
                  : watchedValue || field.defaultValue
              }
              disabled={isLoading || field.isDisabled}
            >
              <SelectTrigger id={field.id}>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent position="popper">
                {getFilteredList()?.map((data) => (
                  <SelectItem key={data.id} value={data.id}>
                    <div className="w-full flex justify-between px-4">
                      <span>{data.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {data?.formattedData}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorText && errorText !== "" && (
              <p className="px-1 text-xs text-red-600">{errorText}</p>
            )}
          </div>
        );
      case FieldProperty.TEXTAREA:
        return (
          <div className="grid gap-2 col-span-2">
            <Label className="capitalize" htmlFor={field.id}>
              {field.label}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              autoCorrect="off"
              disabled={isLoading}
              {...register(field.id)}
            />
            {errorText && errorText !== "" && (
              <p className="px-1 text-xs text-red-600">{errorText}</p>
            )}
          </div>
        );
      case FieldProperty.MULTI_SELECT:
        return (
          <div className="grid gap-2">
            <Label className="capitalize" htmlFor={field.id}>
              {field.label}
            </Label>
            <MultiSelector
              onValuesChange={handleMultiSelectChange}
              values={getSelectedNames()}
              loop={false}
            >
              <MultiSelectorTrigger id={field.id}>
                <MultiSelectorInput placeholder={field.placeholder} />
              </MultiSelectorTrigger>
              <MultiSelectorContent>
                <MultiSelectorList>
                  {getFilteredList()?.map((data) => (
                    <MultiSelectorItem
                      key={data.id}
                      value={data.name}
                      shortCode={data.shortCode}
                    >
                      <div className="w-full flex justify-between px-4">
                        <span>{data.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {data?.formattedData ?? data?.shortCode}
                        </span>
                      </div>
                    </MultiSelectorItem>
                  ))}
                </MultiSelectorList>
              </MultiSelectorContent>
            </MultiSelector>
            {errorText && errorText !== "" && (
              <p className="px-1 text-xs text-red-600">{errorText}</p>
            )}
          </div>
        );
      case FieldProperty.DATE_PICKER:
        return (
          <div className="grid gap-2 col-span-2">
            <Label className="capitalize" htmlFor={field.id}>
              {field.label}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !watchedValue && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchedValue ? (
                    format(watchedValue, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watchedValue}
                  onSelect={(value) => {
                    setValue(field.id, value as Date);
                    clearErrors(field.id);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errorText && errorText !== "" && (
              <p className="px-1 text-xs text-red-600">{errorText}</p>
            )}
          </div>
        );
      case FieldProperty.LOCATION_DROPDOWN:
        return (
          <div className="grid gap-2 w-fill">
            <Label className="capitalize" htmlFor={field.id}>
              {field.label}
            </Label>
            <LocationDropdown
              list={getFilteredList()}
              onValueChange={(selectedValue) => {
                setValue(field.id, selectedValue);
                clearErrors(field.id);
              }}
              selectedValue={watchedValue}
              label={field.label}
            />

            {errorText && errorText !== "" && (
              <p className="px-1 text-xs text-red-600">{errorText}</p>
            )}
          </div>
        );
      case FieldProperty.CHECKBOX:
        return (
          <div className="grid gap-2">
            <Label className="capitalize" htmlFor={field.id}>
              {field.label}
            </Label>
            <Checkbox
              id={field.id}
              checked={watchedValue}
              onCheckedChange={(value) => setValue(field.id, value)}
              disabled={isLoading}
            />
            {errorText && errorText !== "" && (
              <p className="px-1 text-xs text-red-600">{errorText}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className={cn("grid gap-6 grow")}>
      <form
        onSubmit={handleSubmit(onSubmitHandler)}
        className="flex flex-col gap-4"
      >
        <div className="grow">
          <div className="grid gap-4 ">
            {filteredFormFields.map((field: FormFields, index: number) => (
              <div key={index}>{renderField(field)}</div>
            ))}
            {customForm &&
              cloneElement(customForm as React.ReactElement, {
                ref: customFormRef,
              })}
          </div>
        </div>
        <div className="flex-none flex justify-center">
          <button
            className={cn(buttonVariants(), "w-full")}
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
