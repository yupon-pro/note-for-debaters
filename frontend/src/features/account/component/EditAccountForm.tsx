"use client";

import AuthForm from "@/features/common/components/AuthForm";
import FormSubmitButton from "@/features/common/components/FormSubmitButton";
import { Text, VStack } from "@chakra-ui/react";
import { useFormState, useFormStatus } from "react-dom";
import { LuUser } from "react-icons/lu";
import { RiLockPasswordLine } from "react-icons/ri";
import { editAccountFormAction } from "../libs/accountFormAction";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const initialValues = {
  status: "Pending",
  errors: {
    name: undefined,
    password: undefined,
    confirmPassword: undefined,
  },
  message: "",
} as const;

export default function EditAccountForm() {
  const [state, dispatch] = useFormState(editAccountFormAction, initialValues);
  const { data } = useFormStatus();
  const { data:session, update } = useSession();

  useEffect(() => {
    const name = data?.get("name") || null;
    if(!name) return;
    if(!session || !session.user) return;
    if(state.status !== "Success") return;
    update({ ...session.user, name })
  }, [state.status])

  return(
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