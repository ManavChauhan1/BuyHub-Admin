import prismadb from '@/lib/prismadb'
import React from 'react'

import { ProductForm } from './components/product-form';

const ProductPage = async ({
    params
}: {
    params: {productId: string, storeId: string}
}) => {

    //Params are changed to awaitedParams
    const awaitedParams = await params;

    const product = await prismadb.product.findUnique({
        where: {
            id: awaitedParams.productId
        },
        include: {
            images: true
        }
    });

    const formattedProduct = product ? {
        ...product,
        price: product.price.toNumber() // Convert the price Decimal to a number
    } : null;

    const categories = await prismadb.category.findMany({
        where: {
            storeId: awaitedParams.storeId,
        }
    })

    const sizes = await prismadb.size.findMany({
        where: {
            storeId: awaitedParams.storeId,
        }
    })

    const colors = await prismadb.color.findMany({
        where: {
            storeId: awaitedParams.storeId,
        }
    })

    return (
        <div className='flex-col'>
            <div className='flex-1 space-y-4 p-8 pt-6'>
                <ProductForm
                    categories = {categories}
                    colors =  {colors}
                    sizes = {sizes}
                    initialData={formattedProduct}
                />
            </div>
        </div>
    )
}

export default ProductPage