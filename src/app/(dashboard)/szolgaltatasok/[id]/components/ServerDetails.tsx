import { Cpu, HardDrive, MemoryStickIcon as Memory } from "lucide-react";
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

interface ServerDetailsProps {
    service: {
        type: string;
        more_info: {
            cpu: number;
            memory: number;
            storage: number;
            storage_unit: string;
            memory_unit: string;
        };
    };
}

export default function ServerDetails({ service }: ServerDetailsProps) {
    return (
        <Card className="overflow-hidden border-border/60 shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="bg-gray-50/50 dark:bg-gray-800/50 pb-3">
                <div className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-indigo-500" />
                    <CardTitle className="text-lg">Szerver részletek</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
                <InfoRow
                    icon={<Cpu className="h-4 w-4 text-indigo-600" />}
                    label="CPU"
                    value={`${service.more_info.cpu} ${service.type === "game" ? "%" : "db"}`}
                    iconBg="bg-indigo-100 dark:bg-indigo-900/30"
                />
                <InfoRow
                    icon={<Memory className="h-4 w-4 text-blue-600" />}
                    label="RAM"
                    value={`${service.more_info.memory.toFixed(1)} ${service.more_info.memory_unit}`}
                    iconBg="bg-blue-100 dark:bg-blue-900/30"
                />
                <InfoRow
                    icon={<HardDrive className="h-4 w-4 text-teal-600" />}
                    label="Tárhely"
                    value={`${service.more_info.storage.toFixed(1)} ${service.more_info.storage_unit}`}
                    iconBg="bg-teal-100 dark:bg-teal-900/30"
                />
            </CardContent>
        </Card>
    );
}
