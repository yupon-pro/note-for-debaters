"use client"

import { VStack } from "@chakra-ui/react"
import { useFormState } from "react-dom"
import { signInFormAction, } from "../libs/authFormActions"
import { CiMail } from "react-icons/ci"
import AuthForm from "../../common/components/AuthForm"
import { RiLockPasswordLine } from "react-icons/ri"
import FormSubmitButton from "../../common/components/FormSubmitButton"

const initialValues = {
  errors: {
    email: [],
    password: [],
  },
  message: "",
};

export default function SignIn() {
  const [state, dispatch] = useFormState(signInFormAction, initialValues);

  return (
    <form action={dispatch}>
      <VStack gap="4" align="flex-start" maxW="50%" my="0" mx="auto">
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
          startIcon={<RiLockPasswordLine />}
          errors={state.errors?.password}
        />
        <FormSubmitButton />
      </VStack>
    </form>
  )
}