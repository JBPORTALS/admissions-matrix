"use client";

import * as React from "react";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Field } from "@chakra-ui/react";
import { cn } from "./utils";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormItem = React.forwardRef<
  React.ComponentRef<typeof Field.Root>,
  Field.RootProps
>(({ className, ...props }, ref) => {
  const { invalid } = useFormField();

  return (
    <Field.Root
      invalid={invalid}
      ref={ref}
      className={cn(className)}
      {...props}
    />
  );
});

FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  React.ComponentRef<typeof Field.Label>,
  Field.LabelProps
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Field.Label
      ref={ref}
      _invalid={{ color: "fg.error" }}
      className={cn(error, className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});

FormLabel.displayName = "FormLabel";

const FormDescription = React.forwardRef<
  React.ComponentRef<typeof Field.HelperText>,
  Field.HelperTextProps
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <Field.HelperText
      ref={ref}
      id={formDescriptionId}
      className={cn(className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  React.ComponentRef<typeof Field.ErrorText>,
  Field.ErrorTextProps
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message ?? "") : children;

  if (!body) {
    return null;
  }

  return (
    <Field.ErrorText
      ref={ref}
      id={formMessageId}
      className={cn(className)}
      {...props}
    >
      {body}
    </Field.ErrorText>
  );
});
FormMessage.displayName = "FormMessage";

export {
  useFormField,
  Form,
  FormLabel,
  FormDescription,
  FormMessage,
  FormField,
  FormItem,
};
