import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
//THESE ARE FOR INDIVIDUALLY MANAGING THE COLORS

//Function to GET the existing COLORS
export async function GET(
    req: Request,
    { params }: {params: Promise<{ colorId: string }> }
) {
    try{
        const awaitedParams = await params;

        if(!awaitedParams.colorId){
            return new NextResponse("Color ID is required", { status: 400});
        }

        const color = await prismadb.color.findUnique({
            where: {
                id: awaitedParams.colorId
            }
        });

        return NextResponse.json(color);

    } catch(error){
        console.log('[COLOR_GET]', error);        
        return new NextResponse("Internal Error", { status: 500});
    }
}

//Function to Update the COLOR name
export async function PATCH(
    req: Request,
    { params }: {params: Promise<{ storeId: string, colorId: string }> }
) {
    try{
        const { userId } = await auth();
        const body = await req.json();
        const awaitedParams = await params;


        const { name, value } = body;

        if( !userId ){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name){
            return new  NextResponse("Name is required", { status : 400 });
        }

        if(!value){
            return new  NextResponse("Value is required", { status : 400 });
        }

        if(!awaitedParams.colorId){
            return new NextResponse("Color ID is required", { status: 400});
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

        const color = await prismadb.color.updateMany({
            where: {
                id: awaitedParams.colorId
            },
            data: {
                name, 
                value
            }
        });

        return NextResponse.json(color);

    } catch(error){
        console.log('[COLOR_PATCH]', error);        
        return new NextResponse("Internal Error", { status: 500});
    }
}

//Function to Delete any existing COLOR
export async function DELETE(
    req: Request,
    { params }: {params: Promise<{storeId: string, colorId: string }> }
) {
    try{
        const { userId } = await auth();

        const awaitedParams = await params;


        if( !userId ){
            return new NextResponse("Unauthenticated", { status: 401 });
        }


        if(!awaitedParams.colorId){
            return new NextResponse("Color ID is required", { status: 400});
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

        const color = await prismadb.color.deleteMany({
            where: {
                id: awaitedParams.colorId
            }
        });

        return NextResponse.json(color);

    } catch(error){
        console.log('[COLOR_DELETE]', error);        
        return new NextResponse("Internal Error", { status: 500});
    }
}