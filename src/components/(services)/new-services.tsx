"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfigurationModal } from "@/components/(services)/configuration-modal";
import { Check, Gamepad, Server, Globe, ArrowLeft, Database, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes";

interface ServiceOption {
    label: string;
    price?: number;
    min?: number;
    step?: number;
}

interface Service {
    id: string;
    name: string;
    description: string;
    features: string;
    price?: number;
    image: string;
    options: ServiceOption[];
    type: string;
    offer: string;
    other: string;
    gradientColors: string;
}

interface LocalService {
    id: string;
    name: string;
    description: string;
    features: string;
    price?: number;
    image: string;
    options: ServiceOption[];
    type: string;
    offer: string;
    other: string;
    gradientColors: string;
}

const NewServices = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { theme } = useTheme();

    const [services, setServices] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<LocalService | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/sign-in');
        }
    }, [status, session, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            const fetchServices = async () => {
                try {
                    const response = await fetch(`/api/services/list`);
                    const data: Service[] = await response.json();
                    if (Array.isArray(data)) {
                        setServices(data);
                    } else {
                        console.error("Invalid data format:", data);
                    }
                } catch (error) {
                    console.error("Error fetching services:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchServices();
        }
    }, [status]);

    if (loading) {
        return (
            <div className={`flex items-center justify-center min-h-screen ${theme === 'dark' ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-gray-100 to-white'}`}>
                <div className="animate-pulse flex flex-col items-center">
                    <div className={`h-12 w-48 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'} rounded-lg mb-8`}></div>
                    <div className="grid grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={`h-64 w-64 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'} rounded-xl`}></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const filteredServices = selectedCategory ? services.filter(service => service.type === selectedCategory) : [];

    return (
        <div className={`${theme === 'dark' ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-gray-100 to-white'} min-h-full`}>
            <div className="container mx-auto py-10 px-4">
                <h1 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-center`}>Szolgáltatások</h1>

                {!selectedCategory ? (
                    <div className="mb-12">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.6 }}
                            >
                                <CategoryCard
                                    title="VPS"
                                    description="Speciális és egyedi szolgáltatások"
                                    icon={<Server className="h-12 w-12" />}
                                    gradient="from-amber-500 to-orange-500"
                                    onClick={() => {
                                        setSelectedCategory("vps");
                                        setSelectedCategoryName("VPS");
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                            >
                                <CategoryCard
                                    title="Játékszerver"
                                    description="Speciális és egyedi szolgáltatások"
                                    icon={<Gamepad className="h-12 w-12" />}
                                    gradient="from-amber-500 to-orange-500"
                                    onClick={() => {
                                        setSelectedCategory("game");
                                        setSelectedCategoryName("Játékszerver");
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                            >
                                <CategoryCard
                                    title="Dedikált szerver"
                                    description="Nagy teljesítményű dedikált szerverek"
                                    icon={<Server className="h-12 w-12" />}
                                    gradient="from-purple-500 to-indigo-500"
                                    onClick={() => {
                                        setSelectedCategory("dedikált");
                                        setSelectedCategoryName("Dedikált szervergép");
                                    }}
                                />
                            </motion.div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0 }}
                            >
                                <CategoryCard
                                    title="Webtárhely"
                                    description="Weboldal és alkalmazás szolgáltatások"
                                    icon={<Globe className="h-12 w-12" />}
                                    gradient="from-blue-500 to-cyan-400"
                                    onClick={() => {
                                        setSelectedCategory("web");
                                        setSelectedCategoryName("Webszerver");
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                            >
                                <CategoryCard
                                    title="Egyéb"
                                    description="Speciális és egyedi szolgáltatások"
                                    icon={<Database className="h-12 w-12" />}
                                    gradient="from-amber-500 to-orange-500"
                                    onClick={() => {
                                        setSelectedCategory("other");
                                        setSelectedCategoryName("Egyéb");
                                    }}
                                />
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center justify-between mb-8 relative">
                            <Button
                                variant="ghost"
                                className={`${theme === 'dark' ? 'text-white hover:bg-slate-800/50' : 'text-gray-900 hover:bg-gray-200/50'} absolute left-0`}
                                onClick={() => setSelectedCategory(null)}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Vissza
                            </Button>
                            <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} w-full text-center`}>
                                {selectedCategoryName}
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.isArray(filteredServices) && filteredServices.map((service: Service) => (
                                <Card
                                    key={service.id}
                                    className={`overflow-hidden transition-all hover:shadow-lg hover:translate-y-[-4px] flex flex-col ${theme === 'dark' ? 'bg-white/5 backdrop-blur-sm border-slate-700' : 'bg-white border-gray-200'}`}
                                >
                                    <CardHeader
                                        className={`bg-gradient-to-r from-blue-600 to-indigo-600 text-white`}
                                        style={{ minHeight: "150px" }}
                                    >
                                        <CardTitle className="text-2xl flex items-center gap-2">
                                            {service.type === "game" && <Gamepad className="h-6 w-6" />}
                                            {service.type === "vps" && <Server className="h-6 w-6" />}
                                            {service.type === "web" && <Globe className="h-6 w-6" />}
                                            {service.name}
                                        </CardTitle>
                                        <CardDescription className="text-gray-100">
                                            {service.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className={`pt-6 flex-grow ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        <p className="text-3xl font-bold mb-4">{service.price}</p>
                                        <ul className="space-y-2">
                                            {service.features &&
                                                typeof service.features === "string" &&
                                                JSON.parse(service.features).map((feature: string, index: number) => (
                                                    <li key={index} className="flex items-center">
                                                        <Check className="mr-2 text-green-500 h-5 w-5 flex-shrink-0" />
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter className={`border-t ${theme === 'dark' ? 'border-slate-700' : 'border-gray-200'} pt-4`}>
                                        <Button
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                                            onClick={() => setSelectedService(service)}
                                        >
                                            {service.name} Vásárlása
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {selectedService && (
                    <>
                        <ConfigurationModal
                            service={selectedService as any}
                            isOpen={!!selectedService}
                            onClose={() => setSelectedService(null)}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

interface CategoryCardProps {
    title: string;
    description: string;
    icon: JSX.Element;
    gradient: string;
    onClick: () => void;
}

const CategoryCard = ({
    title,
    description,
    icon,
    gradient,
    onClick,
}: CategoryCardProps) => {
    const { theme } = useTheme();
    
    return (
        <div
            className={`bg-gradient-to-br ${gradient} relative p-8 text-white rounded-xl shadow-xl transition-all cursor-pointer hover:shadow-2xl hover:scale-105 transform duration-500 h-[250px] min-w-[300px] overflow-hidden group`}
            onClick={onClick}
        >
            <div className={`absolute top-0 left-0 right-0 bottom-0 z-0 ${theme === 'dark' ? 'bg-black/20' : 'bg-black/10'} rounded-xl backdrop-blur-sm group-hover:bg-black/10 transition-all duration-500`}></div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500">{icon}</div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-glow">{title}</h3>
                <p className="text-sm text-center leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">{description}</p>
            </div>
        </div>
    );
};

export default NewServices;