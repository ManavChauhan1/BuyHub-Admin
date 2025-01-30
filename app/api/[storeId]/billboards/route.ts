import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

// THIS IS FOR GETTING ALL THE BILLBOARDS ACCORDING TO STORE ID

export async function POST(
    req: Request,
    { params }: {params: { storeId: string}}
) {
    try{
        const { userId } = await auth();
        const body = await req.json(); //used req.body instead of req.json()
        const { label, imageUrl } = body;

        const awaitedParams = await params;


        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!label){
            return new NextResponse("Label is required", {status:400});
        }

        if(!imageUrl){
            return new NextResponse("Image URL is required", {status:400});
        }

        if(!awaitedParams.storeId){
            return new NextResponse("Store ID is required", {status:400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: awaitedParams.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403 });
        }

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: awaitedParams.storeId
            }
        });

        return NextResponse.json(billboard);

    } catch(error){
        console.log('[BILLBOARDS_POST]' ,error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: {params: { storeId: string}}
) {
    try{

        const awaitedParams = await params;


        if(!awaitedParams.storeId){
            return new NextResponse("Store ID is required", {status:400});
        }

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: awaitedParams.storeId
            }
        });

        return NextResponse.json(billboards);

    } catch(error){
        console.log('[BILLBOARDS_GET]' ,error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}