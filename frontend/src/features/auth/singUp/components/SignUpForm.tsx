"use client"

import {  VStack, Text } from "@chakra-ui/react"
import { useFormState } from "react-dom"
import { signUpFormAction } from "../../utils/formActions"
import { LuUser } from "react-icons/lu"
import { CiMail } from "react-icons/ci"
import AuthForm from "../../common/AuthForm"
import { RiLockPasswordLine } from "react-icons/ri"
import FormSubmitButton from "../../common/FormSubmitButton"
import { useEffect } from "react"
import { useSetAtom } from "jotai"
import { signUpFormStatusAtom, stepErrorAtom } from "@/jotai/SignUpStepAtom"

const initialValues = {
  status: "Initial",
  errors: {
    name: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
  },
  message: "",
} as const;

export default function SignUpForm() {
  const [state, dispatch] = useFormState(signUpFormAction, initialValues);
  const setSignUpFormStatus = useSetAtom(signUpFormStatusAtom);
  const setStepError = useSetAtom(stepErrorAtom);
  console.log(state.errors);
  useEffect(() => {
    const status = state.status;
    if(status === "Initial") return;

    if(status === "Success") {
      setStepError(false);
      setSignUpFormStatus(status);
    
    }else if(status === "Failure"){
      setStepError(true);
      setSignUpFormStatus(status);

    }
  }, [state.status]);

  return (
    <form action={dispatch}>
      <VStack gap={5} align="start" maxW="50%" mx="auto" my="0" >
        <AuthForm
          name="name"
          type="text"
          placeholder="note for debater"
          startIcon={<LuUser />}
          errors={state.errors?.name}
        />
        <AuthForm
          name="email"
          type="email"
          placeholder="note@example.com"
          startIcon={<CiMail />}
          errors={state.errors?.email}
        />
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
      </VStack>
    </form>
  )
}

