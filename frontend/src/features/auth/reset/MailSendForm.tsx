"use client";

import { useFormState } from "react-dom";
import { IoKeyOutline } from "react-icons/io5";
import { verifyEmailFormAction } from "../libs/formActions";
import AuthForm from "../common/AuthForm";
import FormSubmitButton from "../common/FormSubmitButton";
import { Text } from "@chakra-ui/react";

const initialValue = {
  errors: {
    email: undefined
  },
  message: "",
};

export default function MailSendForm(){
  const [state, dispatch] = useFormState(verifyEmailFormAction, initialValue);

  return(
    <form action={dispatch}>
      <AuthForm 
        name="email"
        type="email"
        placeholder="example@gmail.com"
        startIcon={<IoKeyOutline />}
        errors={state.errors?.email}
      />
      <FormSubmitButton />
      { state.message && <Text textAlign="center" color="red">{state.message}</Text> }
    </form>
  );

}