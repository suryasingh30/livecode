import { Dialog, DialogContent } from './ui/dialog';
import Image from 'next/image';
import React, { ReactNode } from 'react'
import { cn } from "@/lib/utils";
import { Button } from './ui/button';

interface MeetingModalProps{
    isOpen: boolean;
    onClose: ()=>void;
    title: string;
    className?: string;
    buttonText?: string;
    handleClick: () => void;
    image?: string;
    buttonClassName?: string;
    buttonIcon?: string;
    children?: ReactNode;
}

export const MeetingModal = ({isOpen, onClose, title, className, buttonText, handleClick, image, children, buttonIcon} : MeetingModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='flex w-full max-w-[420px] flex-col gap-6 border-none bg-[#161A2C] px-6 py-9 text-white'>
            <div className='flex flex-col gap-6'>
            {image && (
                <div className='flex justify-center'>
                    <Image src={image} alt= "checked" width={72} height={72}/>
                </div>
            )}
            <h1 className={cn("text-3xl font-bold leading-[42px]", className)}>
                {title}
            </h1>
            {children}
            <Button className={"bg-[#0B52A9] focus-visible:ring-0 focus-visible::ring-offset-0"} onClick={handleClick}>
                {buttonIcon && (
                    <Image
                        src={buttonIcon}
                        alt="button-icon"
                        width={13}
                        height={13}
                    />
                )}{" "}
                &nbsp;
                {buttonText || "Schedule Meeting"}
            </Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}
