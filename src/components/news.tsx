import { Bell, Clock } from "lucide-react"

const announcements = [
    {
        id: 1,
        title: "Tisztelt Ügyfeleink",
        timestamp: "Közzétéve múlt csütörtökön 19:13-kor",
        content:
            "Az ügyfél-szolgáltatói kapcsolat számunkra fontos, emiatt szükségesnek érezzük ezen bejegyzés publikálását! A jelenlegi ügyfélkapunk fejlesztése LEÁLL, ezen ügyfélkapu fejlesztője kilépett csapatunkból.",
        author: {
            name: "Kovács János",
            avatar: "/logo/logo.png?height=40&width=40",
        },
    },
    {
        id: 2,
        title: "Rendszerkarbantartás",
        timestamp: "Közzétéve múlt pénteken 15:30-kor",
        content:
            "A kód használhatatlansága miatt NEM fejlesszük tovább, a használhatatlanság alatt sajnos több tényező van, és nem, megvan a forráskód, csak sajnos egyátalán nem biztonságos!",
        author: {
            name: "Nagy Éva",
            avatar: "/placeholder.svg?height=40&width=40",
        },
    },
    {
        id: 3,
        title: "Fejlesztési Hírek",
        timestamp: "Közzétéve tegnap 10:45-kor",
        content:
            "Emiatt az ügyfélkapu teljes körűen ÚJRAÍRÁSRA kerül, az összes feldobott/bedobott ötletekkel, és hibajavításokkal, addig jelenlegi ügyfélkapunk 0-24 elérhető.",
        author: {
            name: "Szabó Péter",
            avatar: "/placeholder.svg?height=40&width=40",
        },
    },
]

const News = () => {
    return (
        <div className="min-h-scree p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-8 flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                    Rendszerüzenetek
                </h1>

                <div className="space-y-8">
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className="relative">
                            <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-700 ml-6 -z-10" />

                            <div className="flex gap-4 items-start">
                                <div className="relative">
                                    <img
                                        src={announcement.author.avatar || "/placeholder.svg"}
                                        alt={announcement.author.name}
                                        className="w-12 h-12 rounded-full border-4 border-slate-800"
                                    />
                                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-blue-500 ring-2 ring-slate-800" />
                                </div>

                                <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                                    <div className="pb-4">
                                        <div className="flex justify-between items-start gap-4 flex-wrap">
                                            <h2 className="text-xl text-white font-semibold">{announcement.title}</h2>
                                            <div className="flex items-center text-sm text-slate-400 whitespace-nowrap">
                                                <Clock className="h-4 w-4 mr-1 inline-block" />
                                                {announcement.timestamp}
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-400 mt-1">{announcement.author.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-300 leading-relaxed">{announcement.content}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default News

