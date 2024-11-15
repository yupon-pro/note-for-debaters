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
      orientation="horizontal"
      invalid={!!errors?.length}
      errorText={ErrorTexts(errors)}
    >
      <InputGroup flex="1" startElement={startIcon}>
        <Input
          name={name}
          variant="outline"
          size="xs"
          placeholder={placeholder}
          type={type}
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