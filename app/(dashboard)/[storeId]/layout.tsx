import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{storeId: string}>
}) {
    const { userId } = await auth();
    const paramsAwaited = await params
    
    if(!userId){
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: paramsAwaited.storeId,
            userId
        }
    });

    if(!store){
        redirect('/');
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    )
}