import { Server, CreditCard, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InfoRowProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    iconBg: string;
}

const InfoRow = ({ icon, label, value, iconBg }: InfoRowProps) => (
    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${iconBg}`}>
                {icon}
            </div>
            <span className="text-gray-600 dark:text-gray-300">{label}</span>
        </div>
        <span className="font-medium text-gray-800 dark:text-white">{value}</span>
    </div>
);

interface ServiceInfoProps {
    service: {
        type: string;
        price: number;
    };
    ips: string;
}

export default function ServiceInfo({ service, ips }: ServiceInfoProps) {
    return (
        <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                <div className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-blue-500" />
                    <CardTitle className="text-lg">Szolgáltatás adatai</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <InfoRow
                    icon={<Server className="h-4 w-4 text-blue-600" />}
                    label="Típus"
                    value={service.type === 'game' ? 'Játékszerver' : 'VPS'}
                    iconBg="bg-blue-100 dark:bg-blue-900/30"
                />
                <InfoRow
                    icon={<CreditCard className="h-4 w-4 text-green-600" />}
                    label="Ár"
                    value={`${service.price.toLocaleString("hu-HU")} Ft/hó`}
                    iconBg="bg-green-100 dark:bg-green-900/30"
                />
                <InfoRow
                    icon={<Wifi className="h-4 w-4 text-purple-600" />}
                    label="IP cím"
                    value={ips}
                    iconBg="bg-purple-100 dark:bg-purple-900/30"
                />
            </CardContent>
        </Card>
    );
}
