import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    try{
        const services = await db.serviceList.findMany();

        const servicesWithFromPrice = services.map(service => {
            let fromPrice = null

            try {
                console.log(service)
                const options = JSON.parse(service.options || "{}");

                let totalMinPrice = 0;

                for (const opt of options) {
                    if (typeof opt.price === 'number' && typeof opt.min === 'number') {
                        const itemMinPrice = (opt.price * opt.min) / (opt.step || 1);
                        totalMinPrice += itemMinPrice;
                    }
                }

                fromPrice = `${Math.round(totalMinPrice)} Ft-tól`
            } catch (error) {
                console.error("Error parsing options:", error);
            }

            return {
                name: service.name,
                fromPrice,
            }
        })

        // console.log("servicesWithFromPrice", servicesWithFromPrice)
        return NextResponse.json(servicesWithFromPrice, {status: 200})
       
    } catch (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}