import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
//THESE ARE FOR INDIVIDUALLY MANAGING THE BILLBOARDS

//Function to GET the existing Billboard
export async function GET(
    req: Request,
    { params }: {params: Promise<{ billboardId: string }> }
) {
    try{
        const awaitedParams = await params;

        if(!awaitedParams.billboardId){
            return new NextResponse("Billboard ID is required", { status: 400});
        }

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: awaitedParams.billboardId
            }
        });

        return NextResponse.json(billboard);

    } catch(error){
        console.log('[BILLBOARD_GET]', error);        
        return new NextResponse("Internal Error", { status: 500});
    }
}

//Function to Update the Billboard Name
export async function PATCH(
    req: Request,
    { params }: {params: Promise<{ storeId: string, billboardId: string }> }
) {
    try{

        const awaitedParams = await params;

        const { userId } = await auth();
        const body = await req.json();

        const { label, imageUrl } = body;

        if( !userId ){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!label){
            return new  NextResponse("Label is required", { status : 400 });
        }

        if(!imageUrl){
            return new  NextResponse("Image URL is required", { status : 400 });
        }

        if(!awaitedParams.billboardId){
            return new NextResponse("Billboard ID is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: awaitedParams.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403});
        }

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: awaitedParams.billboardId
            },
            data: {
                label, 
                imageUrl
            }
        });

        return NextResponse.json(billboard);

    } catch(error){
        console.log('[BILLBOARD_PATCH]', error);        
        return new NextResponse("Internal Error", { status: 500});
    }
}

//Function to Delete any existing Billboard
export async function DELETE(
    req: Request,
    { params }: {params: Promise<{storeId: string, billboardId: string }> }
) {
    try{
        const { userId } = await auth();

        const awaitedParams = await params;

        if( !userId ){
            return new NextResponse("Unauthenticated", { status: 401 });
        }


        if(!awaitedParams.billboardId){
            return new NextResponse("Billboard ID is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: awaitedParams.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403});
        }

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: awaitedParams.billboardId
            }
        });

        return NextResponse.json(billboard);

    } catch(error){
        console.log('[BILLBOARD_DELETE]', error);        
        return new NextResponse("Internal Error", { status: 500});
    }
}