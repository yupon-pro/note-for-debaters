import { Button } from "@/components/ui/button";
import {  DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Radio, RadioGroup } from "@/components/ui/radio";
import PrivacyPolicy from "@/features/common/components/PrivacyPolicy";
import { consentStatusAtom } from "@/jotai/SignUpStepAtom";
import { Box, HStack, VStack } from "@chakra-ui/react";
import { useAtom } from "jotai";



export default function ConsentForm(){
  const [consentStatus, setConsentStatus] = useAtom(consentStatusAtom);

  function handleConcent() {
    setConsentStatus(true);
  }

  return (
    <VStack gap={7} >
      <DialogRoot placement="center" >
        <DialogTrigger asChild>
          <Box 
            width="80%"
            padding={3}
            border="1px black solid" 
            overflow="scroll"
            maxHeight="50vh"
          >
            <PrivacyPolicy />
          </Box>

        </DialogTrigger>
        <DialogContent
          bgColor="white"
        >
          <DialogHeader >
            <DialogTitle>
              Privacy Policy
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Box 
              padding={5}
              maxH="70vh"
              overflow="scroll"
            >
              <PrivacyPolicy />
            </Box>
          </DialogBody>
          <DialogFooter
            gap={10}
          >
            <DialogActionTrigger asChild>
              <Button variant="outline">
                Cancel
              </Button>
            </DialogActionTrigger>
            <DialogActionTrigger>
              <Button onClick={handleConcent} variant="outline">
                Concent
              </Button>
            </DialogActionTrigger>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
      <RadioGroup
        width="full"
        size="sm"
        variant="subtle"
        colorPalette="teal" 
        value={Number(consentStatus).toString()}
        onValueChange={(e) => setConsentStatus(!!Number(e.value))}
      >
        <HStack justifyContent="space-evenly" >
          <Radio 
            value="0" 
            border="1px solid skyblue" 
            padding={2} 
            paddingRight={4} 
            rounded={5} 
          >
            Decline
          </Radio>
          <Radio 
            value="1"
            border="1px solid skyblue" 
            padding={2} 
            paddingRight={4} 
            rounded={5}
          >
            Concent
          </Radio>
        </HStack>
      </RadioGroup>
    </VStack>
  );
}