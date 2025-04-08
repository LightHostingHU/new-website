import { motion } from 'framer-motion';
import { RefreshCw, ArrowRight, Edit, XCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ActionButtonProps {
    icon: React.ReactNode;
    label: string;
    tooltip: string;
    variant?: 'default' | 'outline';
    className?: string;
    onClick?: () => void;
}

const ActionButton = ({ icon, label, tooltip, variant = 'default', className = '', onClick }: ActionButtonProps) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant={variant}
                    className={`w-full py-6 ${className} transition-all group`}
                    onClick={onClick}
                >
                    {icon}
                    {label}
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>{tooltip}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

interface ActionButtonsProps {
    service: {
        type: string;
    };
    onRestartClick: () => void;
    onConfigClick: () => void;
    onExtensionServiceClick: () => void;
    onCancelServiceClick: () => void;
}

export default function ActionButtons({ service, onRestartClick, onConfigClick, onExtensionServiceClick, onCancelServiceClick }: ActionButtonsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-8 space-y-6"
        >
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Műveletek</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ActionButton
                    icon={<RefreshCw className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-300" />}
                    label="Szerver újraindítása"
                    tooltip="A szerver újraindítása kb. 1-2 percet vesz igénybe"
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={onRestartClick}
                />
                <ActionButton
                    icon={<ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />}
                    label="Szolgáltatás hosszabbítása"
                    tooltip="Hosszabbítsa meg előfizetését kedvezményes áron"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={onExtensionServiceClick}
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ActionButton
                    icon={<Edit className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />}
                    label="Konfiguráció módosítása"
                    tooltip="Módosítsa a szerver erőforrásait igény szerint"
                    variant="outline"
                    className="border-yellow-200 hover:bg-yellow-500 hover:text-white"
                    onClick={onConfigClick}
                />
                <ActionButton
                    icon={<XCircle className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />}
                    label="Szolgáltatás lemondása"
                    tooltip="Figyelem: A lemondás végleges művelet!"
                    variant="outline"
                    className="border-red-200 hover:bg-red-500 hover:text-white"
                    onClick={onCancelServiceClick}
                />
            </div>

            <div className="grid grid-cols-1 gap-4">
                <a
                    href={service.type === 'game' ? 'https://dash.lighthosting.hu/' : 'https://vm.lighthosting.hu:4083/'}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button
                        variant="outline"
                        className="w-full py-6 border-blue-200 hover:bg-blue-500 hover:text-white transition-all group"
                    >
                        <ExternalLink className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                        Kezelőfelület megnyitása
                    </Button>
                </a>
            </div>
        </motion.div>
    );
}

