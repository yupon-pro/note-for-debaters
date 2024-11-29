"use client";

import { useFormState } from "react-dom";
import { resetPasswordFormAction } from "../libs/formActions";
import AuthForm from "../common/AuthForm";
import FormSubmitButton from "../common/FormSubmitButton";
import { RiLockPasswordLine } from "react-icons/ri";
import { Text } from "@chakra-ui/react";

const initialValue = {
  errors: {
    password: undefined,
    confirmPassword: undefined
  },
  message: "",
};

export default function ResetForm({ userId, token }: { userId: string, token: string }){
  const formAction = resetPasswordFormAction.bind(null, userId, token);
  const [state, dispatch] = useFormState(formAction, initialValue);

  return(
    <form action={dispatch}>
      <AuthForm
          name="password"
          type="password"
          placeholder="password"
          helperText={`
            Your password must contain 
            special character such as #, ?, !, @, $, %, ^, &, *, -, 
            upper and lower case English letter, 
            number.
            `}
          startIcon={<RiLockPasswordLine />}
          errors={state.errors?.password}
        />
        <AuthForm
          name="confirmPassword"
          type="password"
          placeholder="password"
          startIcon={<RiLockPasswordLine />}
          errors={state.errors?.confirmPassword}
        />
        { state.message && <Text textAlign="center" color="red">{state.message}</Text> }
      <FormSubmitButton />
    </form>
  );

}