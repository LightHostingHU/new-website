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
          <div className="p-6 md:p-10">
              <div className="max-w-6xl mx-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 flex items-center gap-3 hover:text-blue-400 transition-colors">
                      <Bell className="h-7 w-7" />
                      Rendszerüzenetek
                  </h1>

                  
              </div>
          </div>
      )
  }

  export default News
