"use client";
import React, { FC } from "react";
import Image from 'next/image';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { Button } from "./ui/button";
import { verifySecret, sendEmailOTP } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

interface OtpModalProps {
  email: string;
  accountId: string;
}


const OtpModal = ({accountId, email} : {accountId: string; email: string;}) => {


    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true)
    const [password, setPassword] = useState(" ")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try{

            //Call API to verify OTP
            const sessionId = await verifySecret({ accountId, password });

            if(sessionId) router.push('/');

        } catch (error){
            console.log("Failed to verify OTP",error)
        }

        setIsLoading(false);
      };

      const handleResendOTP = async () => {
        await sendEmailOTP({email});
      }
      

/*An OTP has been sent to <span className="pl-1 text-brand">{email}</span>. Please use the OTP to verify your
account (ID: {accountId}).
The above code can be used if you want to display accountId as well while entering OTP.
*/

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader className="relative flex justify-center">
          <AlertDialogTitle className="h2 text-center">Enter your OTP
          <Image src={"/assets/icons/close-dark.svg"} alt={"close"} width={20} height={20} onClick={() => setIsOpen(false)} className="otp-close-button"/>
          </AlertDialogTitle>
          <AlertDialogDescription className="subtitle-2 text-center text-light-100">
            An OTP has been sent to <span className="pl-1 text-brand">{email}</span>. Please use the OTP to verify your
            account.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InputOTP maxLength={6} value={password} onChange={setPassword}>
          <InputOTPGroup className="shad-otp">
            <InputOTPSlot index={0} className="shad-otp-slot"/>
            <InputOTPSlot index={1} className="shad-otp-slot"/>
            <InputOTPSlot index={2} className="shad-otp-slot"/>
            <InputOTPSlot index={3} className="shad-otp-slot"/>
            <InputOTPSlot index={4} className="shad-otp-slot"/>
            <InputOTPSlot index={5} className="shad-otp-slot"/>
          </InputOTPGroup>
            </InputOTP>
          

        <AlertDialogFooter>
            <div className="flex w-full flex-col gap-4"> 
          <AlertDialogAction onClick={handleSubmit} className="shad-submit-btn h-12" type="button">
            Submit 
           {isLoading && (<Image src="/assets/icons/loader.svg" alt="loader" width={24} height={24} className="mt-2 animate-spin"></Image>)}
          </AlertDialogAction>

          <div className="subtitle-2 mt-2 text-center text-light-100">Didn&apos;t get a code?
            <Button type="button" variant="link" className="pl-1 text-brand" onClick={handleResendOTP}>Click to resend</Button>
          </div>
            </div>

        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;
