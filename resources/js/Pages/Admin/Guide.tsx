import MuiInertiaLinkButton from "@/Components/MuiInertiaLinkButton";
import PDFViewer from "@/Components/PDFViewer";
import DashboardAdminLayout from "@/Layouts/Admin/DashboardAdminLayout";
import { asset } from "@/Models/Helper";
import { User } from "@/types";
import { usePage } from "@inertiajs/react";
import React from "react";
import route from "ziggy-js";

export default function Guide() {

    const { props } = usePage();
    const user = props.user as unknown as User;

    const filename = user.roles.some(role => role.name === 'super-admin') ?
        'guide_admin.pdf' :
        user.roles.some(role => role.name === 'instructor') ?
            'guide_instructor.pdf' :
            "";

    return (
        <DashboardAdminLayout
            title="Panduan Pengguna"
        >
            <div className="flex flex-col gap-5 mx-10">
                <div className="flex justify-between">
                    <p className="mt-8 text-2xl">Panduan Pangguna</p>
                    <MuiInertiaLinkButton
                        href={route('guide.download')}
                        isNextPage
                    >
                        Download Panduan Pengguna
                    </MuiInertiaLinkButton>
                </div>
               
                <div className="p-5 rounded-lg border overflow-hidden shadow-2xl shadow-[#c9d4fc] bg-white sm:rounded-3xl flex flex-col gap-3">
                    <div className="">
                        <PDFViewer document={{
                            caption: "Panduan Penggunaan Sistem",
                            document_file: {
                                disk: "root",
                                path: "assets/documents/" + filename,
                            }
                        }} height="1200px" />
                    </div>
                    M</div>
            </div>
        </DashboardAdminLayout>
    )
}
