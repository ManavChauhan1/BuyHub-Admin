import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

// THIS IS FOR GETTING ALL THE BILLBOARDS ACCORDING TO Categories Drop Down List

export async function POST(
    req: Request,
    { params }: {params: { storeId: string}}
) {
    try{
        const { userId } = await auth();
        const body = await req.json(); //used req.body instead of req.json()
        const { name, billboardId } = body;

        const awaitedParams = await params;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!name){
            return new NextResponse("Name is required", {status:400});
        }

        if(!billboardId){
            return new NextResponse("Billboard ID is required", {status:400});
        }

        if(!awaitedParams.storeId){
            return new NextResponse("Store ID is required", {status:400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403 });
        }

        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: awaitedParams.storeId
            }
        });

        return NextResponse.json(category);

    } catch(error){
        console.log('[CATEGORIES_POST]' ,error);
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

        const categories = await prismadb.category.findMany({
            where: {
                storeId: awaitedParams.storeId
            }
        });

        return NextResponse.json(categories);

    } catch(error){
        console.log('[CATEGOREIS_GET]' ,error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}