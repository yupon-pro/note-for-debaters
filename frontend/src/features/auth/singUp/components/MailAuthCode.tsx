"use client";

import { IoKeyOutline } from "react-icons/io5";
import AuthForm from "../../common/AuthForm";
import FormSubmitButton from "../../common/FormSubmitButton";
import { useFormState } from "react-dom";
import { verifyMailCodeAction } from "../../utils/formActions";
import { Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { mailCodeStatusAtom, stepErrorAtom } from "@/jotai/SignUpStepAtom";

const initialValue = {
  status: "Initial",
  errors: {
    code: undefined
  },
  message: "",
} as const;

export default function MailAuthCode(){
  const [state, dispatch] = useFormState(verifyMailCodeAction, initialValue);
  const setMailCodeStatusValue = useSetAtom(mailCodeStatusAtom);
  const setStepError = useSetAtom(stepErrorAtom);

  useEffect(() => {
    const status = state.status;
    if(status === "Initial") return;

    if(status === "Success") {
      setStepError(false);
      setMailCodeStatusValue(status);
    
    }else if(status === "Failure"){
      setStepError(true);
      setMailCodeStatusValue(status);

    }
  }, [state.status]);

  return (
    <form action={dispatch} >
      <AuthForm 
        name="code"
        type="text"
        placeholder="36b8f84d-df4e-4d49-b662-bcde71a8764f"
        startIcon={<IoKeyOutline />}
        errors={state.errors?.code}
      />
      { state.message && <Text textAlign="center" color="red">{state.message}</Text> }
      <FormSubmitButton />
    </form>
  );
  
}