import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
//THESE ARE FOR INDIVIDUALLY MANAGING THE PRODUCTS

//Function to GET the existing Products
export async function GET(
    req: Request,
    { params }: {params: Promise<{ productId: string } >}
) {
    try{
        const awaitedParams = await params
        if(!awaitedParams.productId){
            return new NextResponse("Product ID is required", { status: 400});
        }

        const product = await prismadb.product.findUnique({
            where: {
                id: awaitedParams.productId
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            }
        });

        return NextResponse.json(product);

    } catch(error){
        console.log('[PRODUCT_GET]', error);        
        return new NextResponse("Internal Error", { status: 500});
    }
}

//Function to Update the PRODUCT Name
export async function PATCH(
    req: Request,
    { params }: {params: Promise<{ storeId: string, productId: string }> }
) {
    try{
        const awaitedParams = await params
        const { userId } = await auth();
        const body = await req.json();

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

        if( !userId ){
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name){
            return new NextResponse("Name is required", {status:400});
        }
        
        if(!awaitedParams.productId){
            return new NextResponse("Product ID is required", { status: 400});
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

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: awaitedParams.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("Unauthorized", {status: 403});
        }

        await prismadb.product.update({
            where: {
                id: awaitedParams.productId
            },
            data: {
                name,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    deleteMany: {}
                },
                isFeatured,
                isArchived
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: awaitedParams.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image),
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);

    } catch(error){
        console.log('[PRODUCT_PATCH]', error);        
        return new NextResponse("Internal Error", { status: 500});
    }
}

//Function to Delete any existing Product
export async function DELETE(
    req: Request,
    { params }: {params: Promise<{storeId: string, productId: string }> }
) {
    try{
        const awaitedParams = await params
        const { userId } = await auth();


        if( !userId ){
            return new NextResponse("Unauthenticated", { status: 401 });
        }


        if(!awaitedParams.productId){
            return new NextResponse("Product ID is required", { status: 400});
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

        const product = await prismadb.product.deleteMany({
            where: {
                id: awaitedParams.productId
            }
        });

        return NextResponse.json(product);

    } catch(error){
        console.log('[PRODUCT_DELETE]', error);        
        return new NextResponse("Internal Error", { status: 500});
    }
}