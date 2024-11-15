"use client"

import {  Stack } from "@chakra-ui/react"
import { useFormState } from "react-dom"
import { signUpAction } from "../../utils/formActions"
import { LuUser } from "react-icons/lu"
import { CiMail } from "react-icons/ci"
import AuthForm from "../../common/AuthForm"
import { RiLockPasswordLine } from "react-icons/ri"
import FormSubmitButton from "../../common/FormSubmitButton"
import { useEffect } from "react"
import { useSetAtom } from "jotai"
import { signUpFormStatusAtom, stepError } from "@/jotai/SignUpStepAtom"

const initialValues = {
  status: "Initial",
  errors: {
    username: undefined,
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
  },
  message: "",
} as const;

export default function SignUpForm() {
  const [state, dispatch] = useFormState(signUpAction, initialValues);
  const setSignUpFormStatus = useSetAtom(signUpFormStatusAtom);
  const setStepError = useSetAtom(stepError);

  useEffect(() => {
    const status = state.status;
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
      <Stack gap="4" align="flex-start" maxW="sm">
        <AuthForm
          name="username"
          type="text"
          placeholder="note for debater"
          startIcon={<LuUser />}
          errors={state.errors?.username}
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
        <FormSubmitButton />
      </Stack>
    </form>
  )
}

