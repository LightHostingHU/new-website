import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import axios from 'axios';
import { updateServiceConfiguration } from '@/lib/pterodactyl';

type RouteContext = {
    params: Promise<{
        services_id: string;
    }>
};
export async function POST(
    request: NextRequest,
    context: RouteContext
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const params = context.params;
        const { services_id } = await params;
        const serviceId = parseInt(services_id);

        if (isNaN(serviceId)) {
            return NextResponse.json({ error: 'Invalid service ID' }, { status: 400 });
        }

        const service = await db.service.findFirst({
            where: {
                id: serviceId,
                user_id: Number(session.user.id)
            }
        });

        if (!service) {
            return NextResponse.json({ error: 'Service not found' }, { status: 404 });
        }

        const { configData, type, storage_uuid, originalConfig } = await request.json();

        if (!configData || !type || !originalConfig) {
            return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
        }

        const configOptions = await db.service.findMany({
            where: {
                type: type
            }
        });

        for (const option of configOptions) {
            const config = JSON.parse(option.more_info);
            const value = configData[option.service_name];

            if (!config.options && value !== undefined) {
                if (value < config.min || value > config.max) {
                    return NextResponse.json({
                        error: `Invalid value for ${option.service_name}. Must be between ${config.min} and ${config.max}.`
                    }, { status: 400 });
                }
            }
            else if (config.options && value !== undefined) {
                if (!config.options.includes(value)) {
                    return NextResponse.json({
                        error: `Invalid option for ${option.service_name}.`
                    }, { status: 400 });
                }
            }
        }

        const moreInfo = JSON.parse(service.more_info);
        const updatedConfig: { ram?: number; disk?: number; cpu?: number; os?: string } = {};

        if (type === 'game') {
            updatedConfig['ram'] = configData['Szerver ram'] || originalConfig['Szerver ram'];
            updatedConfig['disk'] = configData['Szerver tárhely'] || originalConfig['Szerver tárhely'];
            updatedConfig['cpu'] = configData['CPU használat'] || originalConfig['CPU használat'];
            moreInfo.ram = updatedConfig['ram'];
            moreInfo.ram_unit = 'MB';
            moreInfo.disk = updatedConfig['disk'];
            moreInfo.disk_unit = 'MB';
            moreInfo.cpu = updatedConfig['cpu'];
        } else {
            if (configData['Szerver ram'] && configData['Szerver ram'] !== originalConfig['Szerver ram']) {
                moreInfo.ram = configData['Szerver ram'];
                moreInfo.ram_unit = 'MB';
                updatedConfig['ram'] = configData['Szerver ram'];
            }

            if (configData['Szerver tárhely'] && configData['Szerver tárhely'] !== originalConfig['Szerver tárhely']) {
                moreInfo.disk = configData['Szerver tárhely'];
                moreInfo.disk_unit = 'MB';
                updatedConfig['disk'] = configData['Szerver tárhely'];
            }

            if (configData['CPU mag'] && configData['CPU mag'] !== originalConfig['CPU mag']) {
                moreInfo.cpu = configData['CPU mag'];
                updatedConfig['cpu'] = configData['CPU mag'];
            }

            if (configData['Operációs rendszer'] && configData['Operációs rendszer'] !== originalConfig['Operációs rendszer']) {
                moreInfo.os = configData['Operációs rendszer'];
                updatedConfig['os'] = configData['Operációs rendszer'];
            }
        }        let newPrice = service.price;

        if (type === 'vps' && service.vm_id && Object.keys(updatedConfig).length > 0) {
            try {
                const vpsConfig: { id: number; ram?: number; disk?: number; cpu?: number; os?: string } = {
                    id: service.vm_id,
                };

                if (updatedConfig.ram) vpsConfig['ram'] = updatedConfig.ram;
                if (updatedConfig.disk) vpsConfig['disk'] = updatedConfig.disk / 1024;
                if (updatedConfig.cpu) vpsConfig['cpu'] = updatedConfig.cpu;
                // if (updatedConfig.os) vpsConfig['os'] = updatedConfig.os;

                const response = await axios.post(`${process.env.VIRTUALIZOR_API_URL}/manageVPS.php`, vpsConfig, {
                    headers: {
                        'Authorization': `Bearer ${process.env.VIRTUALIZOR_API_KEY}`
                    }
                });

                const responseData = response.data as { error?: string };
                if (responseData.error) {
                    return NextResponse.json({ error: responseData.error }, { status: 500 });
                }

                await db.service.update({
                    where: {
                        id: serviceId
                    },
                    data: {
                        more_info: JSON.stringify(moreInfo),
                        price: newPrice
                    }
                });
            } catch (error) {
                console.error('Error updating Virtualizor config:', error);
            }
        }

        if (type === 'game' && service.pterodactyl_id ) {
            try {
                const vpsConfig: { id: number; ram?: number; disk?: number; cpu?: number; os?: string } = {
                    id: Number(service.pterodactyl_id),
                    ram: updatedConfig.ram,
                    disk: updatedConfig.disk,
                    cpu: updatedConfig.cpu,
                };
                if (service.panel_id !== null) {
                    const response = await updateServiceConfiguration(service.panel_id.toString(), vpsConfig);
                    if (response.success) {
                        await db.service.update({
                            where: {
                                id: serviceId
                            },
                            data: {
                                more_info: JSON.stringify(moreInfo),
                                price: newPrice
                            }
                        });
                    } else {
                        return NextResponse.json({ error: 'Hiba történt a konfiguráció módosítása' }, { status: 500 });
                    }
                } else {
                    return NextResponse.json({ error: 'Hiba történt a konfiguráció módosítása közben' }, { status: 500 });
                }
            } catch (error) {
                return NextResponse.json(
                    { error: 'Hiba történt a szerver konfigurációjának frissítése közben.' },
                    { status: 500 }
                );
            }
        }        
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}