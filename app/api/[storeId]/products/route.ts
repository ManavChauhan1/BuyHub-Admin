import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

// THIS IS FOR GETTING ALL THE PRODUCTS ACCORDING TO STORE ID

export async function POST(
    req: Request,
    { params }: {params: Promise<{ storeId: string}>}
) {
    try{
        const { userId } = await auth();
        const body = await req.json(); //used req.body instead of req.json()
        const awaitedParams = await params;

        const {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
        } = body;

        if(!userId){
            return new NextResponse("Unauthenticated", {status: 401})
        }

        if(!name){
            return new NextResponse("Name is required", {status:400});
        }

        if(!images || !images.length){
            return new NextResponse("Images is required", {status:400});
        }

        if(!price){
            return new NextResponse("Price is required", {status:400});
        }

        if(!categoryId){
            return new NextResponse("Category ID is required", {status:400});
        }

        if(!sizeId){
            return new NextResponse("Size ID is required", {status:400});
        }

        if(!colorId){
            return new NextResponse("Color ID is required", {status:400});
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

        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                storeId: awaitedParams.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string}) => image) 
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product);

    } catch(error){
        console.log('[PRODUCTS_POST]' ,error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET(
    req: Request,
    { params }: {params: Promise<{ storeId: string}>}
) {
    try{

        const awaitedParams = await params;

        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");


        if(!awaitedParams.storeId){
            return new NextResponse("Store ID is required", {status:400});
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: awaitedParams.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);

    } catch(error){
        console.log('[PRODUCTS_GET]' ,error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}