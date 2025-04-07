export const getStatusColor = (status: string) => {
    switch (status) {
        case "active": return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
        case "pending": return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
        default: return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    }
};

export const getUsageColor = (usagePercent: number) => {
    if (usagePercent < 50) return "bg-green-500";
    if (usagePercent < 80) return "bg-yellow-500";
    return "bg-red-500";
};

export const getStatusText = (status: string) => {
    switch (status) {
        case "active": return "Aktív";
        case "restarting": return "Újraindítás alatt";
        case "suspended": return "Felfüggesztve";
        case "offline": return "Offline";
        case "starting": return "Indítás alatt";
        case "expired": return "Lejárt";
        default: return "Inaktív";
    }
};
