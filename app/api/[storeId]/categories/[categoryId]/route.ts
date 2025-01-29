import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
//THESE ARE FOR INDIVIDUALLY MANAGING THE Categories

//Function to GET the existing Categories
export async function GET(
    req: Request,
    { params }: {params: { categoryId: string } }
) {
    try{
        const awaitedParams = await params;
        
        if(!awaitedParams.categoryId){
            return new NextResponse("Category ID is required", { status: 400});
        }

        const category = await prismadb.category.findUnique({
            where: {
                id: awaitedParams.categoryId
            },
            include: {
                billboard: true
            }
        });

        return NextResponse.json(category);

    } catch(error){
        console.log('[CATEGORY_GET]', error);        
        return new NextResponse("Internal Error", { status: 500});
    }
}

//Function to Update the Category Name
export async function PATCH(
    req: Request,
    { params }: {params: { storeId: string, categoryId: string } }
) {
    try{

        const awaitedParams = await params;


        const { userId } = await auth();
        const body = await req.json();

        const { name, billboardId } = body;

        if( !userId ){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name){
            return new  NextResponse("Name is required", { status : 400 });
        }

        if(!billboardId){
            return new  NextResponse("Billboard ID is required", { status : 400 });
        }

        if(!awaitedParams.categoryId){
            return new NextResponse("Category ID is required", { status: 400});
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

        const category = await prismadb.category.updateMany({
            where: {
                id: awaitedParams.categoryId
            },
            data: {
                name, 
                billboardId
            }
        });

        return NextResponse.json(category);

    } catch(error){
        console.log('[CATEGORY_PATCH]', error);        
        return new NextResponse("Internal Error", { status: 500});
    }
}

//Function to Delete any existing Category
export async function DELETE(
    req: Request,
    { params }: {params: {storeId: string, categoryId: string } }
) {
    try{
        const { userId } = await auth();

        const awaitedParams = await params;

        if( !userId ){
            return new NextResponse("Unauthenticated", { status: 401 });
        }


        if(!awaitedParams.categoryId){
            return new NextResponse("Category ID is required", { status: 400});
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

        const category = await prismadb.category.deleteMany({
            where: {
                id: awaitedParams.categoryId
            }
        });

        return NextResponse.json(category);

    } catch(error){
        console.log('[CATEGORY_DELETE]', error);        
        return new NextResponse("Internal Error", { status: 500});
    }
}