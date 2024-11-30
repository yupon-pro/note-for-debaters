"use client";

import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { Input } from "@chakra-ui/react";

type FieldProps = {
  name: string;
  type: string;
  placeholder: string;
  helperText?: string;
  startIcon?: React.ReactNode;
  errors?: string[];
};

export default function AuthForm({ name, type, placeholder, helperText, startIcon, errors }: FieldProps) {
  return (
    <Field
      required
      label={name[0].toUpperCase() + name.substring(1)}
      helperText={helperText}
      invalid={!!errors?.length}
      errorText={ErrorTexts(errors)}
    >
      <InputGroup width="full" flex="1" startElement={startIcon}>
        <Input
          padding={4}
          name={name}
          type={type}
          variant="outline"
          size="md"
          placeholder={placeholder}
        />
      </InputGroup>
    </Field>
  );
}


function ErrorTexts(errors?: string[]) {
  return(
    <>
      {errors?.map((error, index) => (
        <div key={index}>
          {error}
        </div>
      ))}
    </>
  );
}