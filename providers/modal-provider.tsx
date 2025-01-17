"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";


export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    //Not mounted means we are on the server side
    if(!isMounted){
        return null;
    }

    return (
        <>
            <StoreModal/>
        </>
    )
}