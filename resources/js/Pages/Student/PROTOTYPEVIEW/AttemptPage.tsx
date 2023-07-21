import DashboardLayout from "@/Layouts/Student/DashboardLayout";
import React from "react";

export default function AttemptPage() {
    return (
        <DashboardLayout
            title="Attempt Page"
        >
            <div className="m-7 shadow-lg w-full h-full p-7 rounded-2xl shadow-[#3A63F5]">
                <div className="flex flex-col gap-5 text-center my-20">
                    <div className="text-3xl lg:text-5xl font-bold">
                        Ujian ABC-CAT
                    </div>
                    <div className="lg:text-xl">
                        <p>
                            Kuis Dibuka pada: <span className="font-semibold">12/12/2021</span>
                        </p>
                        <p>
                            Upaya Maksimal: <span className="font-semibold">3</span>
                        </p>
                        <p>
                            Batas Waktu: <span className="font-semibold">120</span> Menit
                        </p>
                    </div>
                    <div>
                        <button className="bg-[#4987fc] hover:bg-blue-700 text-white font-bold py-5 px-7 rounded-full">
                            Mulai Ujian
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
