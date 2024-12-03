"use client";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion"
import EditAccountForm from "./EditAccountForm";
import DeleteAccountCard from "./DeleteAccountCard";

export default function Account() {
  return (
    <AccordionRoot collapsible defaultValue={["b"]}>
      {items.map((item, index) => (
        <AccordionItem key={index} value={item.value}>
          <AccordionItemTrigger>{item.title}</AccordionItemTrigger>
          <AccordionItemContent>{item.content}</AccordionItemContent>
          {/* [TODO] implement delete function */}
        </AccordionItem>
      ))}
    </AccordionRoot>
  )
}

const items = [
  { value: "edit", title: "Edit Account", content: <EditAccountForm /> },
  { value: "delete", title: "Delete Account", content: <DeleteAccountCard /> },
]
