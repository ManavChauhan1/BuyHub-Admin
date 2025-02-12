import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

//Function to Update the Store Name
export async function PATCH(
    req: Request,
    { params }: {params: Promise<{storeId: string }> }
) {
    try{
        const { userId } = await auth();
        const body = await req.json();

        const awaitedParams = await params;

        const { name } = body;

        if( !userId ){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name){
            return new  NextResponse("Name is required", { status : 400 });
        }

        if(!awaitedParams.storeId){
            return new NextResponse("Store ID is required", { status: 400});
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: awaitedParams.storeId,
                userId
            },
            data: {
                name
            }
        });

        return NextResponse.json(store);

    } catch(error){
        console.log('[STORES_PATCH]', error);        
        return new NextResponse("Internal Error", { status: 500});
    }
}

//Function to Delete any existin store
export async function DELETE(
    req: Request,
    { params }: {params: Promise<{storeId: string }> }
) {
    try{
        const { userId } = await auth();

        const awaitedParams = await params;

        if( !userId ){
            return new NextResponse("Unauthenticated", { status: 401 });
        }


        if(!awaitedParams.storeId){
            return new NextResponse("Store ID is required", { status: 400});
        }

        const store = await prismadb.store.deleteMany({
            where: {
                id: awaitedParams.storeId,
                userId
            }
        });

        return NextResponse.json(store);

    } catch(error){
        console.log('[STORES_DELETE]', error);        
        return new NextResponse("Internal Error", { status: 500});
    }
}