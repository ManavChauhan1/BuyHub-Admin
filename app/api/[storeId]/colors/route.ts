import { auth, getAuth } from "@clerk/nextjs/server";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

// THIS IS FOR GETTING ALL THE Colors ACCORDING TO STORE ID

export async function POST(
    req: Request,
    { params }: {params: { storeId: string}}
) {
    try{
        const { userId } = await auth();
        const body = await req.json(); //used req.body instead of req.json()
        const { name, value } = body;

        const awaitedParams = await params;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!name){
            return new NextResponse("Name is required", {status:400});
        }

        if(!value){
            return new NextResponse("Value is required", {status:400});
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

        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: awaitedParams.storeId
            }
        });

        return NextResponse.json(color);

    } catch(error){
        console.log('[COLORS_POST]' ,error);
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

        const colors = await prismadb.color.findMany({
            where: {
                storeId: awaitedParams.storeId
            }
        });

        return NextResponse.json(colors);

    } catch(error){
        console.log('[COLORS_GET]' ,error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}