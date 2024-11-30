"use client";

import { Button } from "@/components/ui/button";
import { CheckboxCard, CheckboxCardIndicator } from "@/components/ui/checkbox-card";
import { Float, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { FaUserSlash } from "react-icons/fa6";
import { deleteAccountAction } from "../libs/accountFormAction";

export default function DeleteAccountCard() {
  const [isDelete, setIsDelete] = useState(false);
  return (
    <CheckboxCard
      align="center"
      icon={
        <Icon fontSize="xl" mb="2" >
          <FaUserSlash />
        </Icon>
      }
      label="delete account"
      description="if you delete account, your data will be eliminated permanently and irreversibly. Is it okay to delete it?"
      indicator={
        <Float placement="top-end" offset="6" onClick={() => setIsDelete((prev) => !prev)} >
          <CheckboxCardIndicator />
        </Float>
      }
      addon={
        !isDelete ? undefined : (<Button onClick={async() => await deleteAccountAction()} >Delete Account</Button>)
      }
    />
  );
}