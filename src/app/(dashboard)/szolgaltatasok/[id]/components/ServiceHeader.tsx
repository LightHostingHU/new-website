import { motion } from 'framer-motion';
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusText } from '../utils/helpers';

interface ServiceHeaderProps {
    service: {
        id: number;
        service_name: string;
        type: string;
        status: string;
        server_id: string;
    };
}

export default function ServiceHeader({ service }: ServiceHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b dark:border-gray-700 pb-6 gap-4"
        >
            <div>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-1">
                    <span>Szolgáltatások</span>
                    <ChevronRight className="h-4 w-4" />
                    <span>Részletek</span>
                </div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">
                    {service.service_name}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    <p className="text-gray-500 dark:text-gray-400">Azonosító: #{service.id}</p>
                    <p className="text-gray-500 dark:text-gray-400">
                        {service.type === 'game' ? 'Pterodactyl felület azonosító:' : 'Kezelőfelület azonosító:'} {service.server_id}
                    </p>
                </div>
            </div>

            <Badge className={`px-4 py-1.5 text-sm font-medium rounded-full ${getStatusColor(service.status)} border`}>
                <span className="relative flex h-2 w-2 mr-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${service.status === "active" ? "bg-green-400" :
                            service.status === "pending" ? "bg-yellow-400" : "bg-red-400"
                        } opacity-75`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${service.status === "active" ? "bg-green-500" :
                            service.status === "pending" ? "bg-yellow-500" : "bg-red-500"
                        }`} />
                </span>
                {getStatusText(service.status)}
            </Badge>
        </motion.div>
    );
}
