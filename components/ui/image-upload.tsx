"use client";

import { useEffect, useState } from "react";
import { ImagePlay, ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[]
}

const ImageUpload:React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {

    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => {
        setIsMounted(true);
    }, []);

    
    const onUpload = (result: any) => {
        console.log("Upload result:", result);  // Inspect the full response
        const uploadedUrl = result?.info?.file?.url || result?.info?.secure_url;

        if (uploadedUrl) {
            console.log("Image uploaded successfully with URL:", uploadedUrl);  // Log the URL
            onChange(uploadedUrl);  // Pass the URL to the form field
        } else {
            console.error("No URL found in the result:", result);
        }
    }


    //Not mounted means we are on the server side
    if(!isMounted){
        return null;
    }

    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="icon">
                                <Trash className="h-4 w-4"/>
                            </Button>
                        </div>
                        <Image 
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>
            {/* onUploadAdded is used instead of onUpload */}
            <CldUploadWidget onSuccess={onUpload} uploadPreset="o4q3t9ck"> 
                {({open}) => {
                    const onClick = () => {
                        open();
                    }

                    return (
                        <Button
                            type="button"
                            disabled = {disabled}
                            variant="secondary"
                            onClick={onClick}
                        >
                            <ImagePlus className="h-4 w-4 mr-2"/>
                            Upload an Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload