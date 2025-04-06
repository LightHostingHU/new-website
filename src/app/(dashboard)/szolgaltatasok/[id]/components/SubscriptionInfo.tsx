import { Calendar, CreditCard, Clock } from "lucide-react";
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

interface SubscriptionInfoProps {
    service: {
        buy_date: string;
        expire_date: string;
    };
}

export default function SubscriptionInfo({ service }: SubscriptionInfoProps) {
    const daysRemaining = Math.ceil(
        (new Date(service.expire_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    <CardTitle className="text-lg">Előfizetés adatai</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <InfoRow
                    icon={<Calendar className="h-4 w-4 text-orange-600" />}
                    label="Kezdés dátuma"
                    value={new Date(service.buy_date).toLocaleDateString('hu-HU')}
                    iconBg="bg-orange-100 dark:bg-orange-900/30"
                />
                <InfoRow
                    icon={<CreditCard className="h-4 w-4 text-red-600" />}
                    label="Következő fizetés"
                    value={new Date(service.expire_date).toLocaleDateString('hu-HU')}
                    iconBg="bg-red-100 dark:bg-red-900/30"
                />
                <InfoRow
                    icon={<Clock className="h-4 w-4 text-amber-600" />}
                    label="Időtartam"
                    value={`${daysRemaining} nap`}
                    iconBg="bg-amber-100 dark:bg-amber-900/30"
                />
            </CardContent>
        </Card>
    );
}
