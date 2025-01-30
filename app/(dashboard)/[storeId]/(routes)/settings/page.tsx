import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { SettingsForm } from "./components/settings-form";

interface SettingsPageProps {
    params: Promise<{
        storeId: string;
    }>
};

const SettingsPage: React.FC<SettingsPageProps> = async ({
    params
}) => {
    const paramsAwaited = await params
    const { userId } = await auth();

    if(!userId){
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: paramsAwaited.storeId,
            userId
        }
    });

    if(!store){
        redirect("/");
    }

    return (
        <div className="flex-col">
            <div className=" flex-1 space-y-4 p-8 pt-6">
                <SettingsForm initialData={store} />
            </div>
        </div>
    )
}

export default SettingsPage