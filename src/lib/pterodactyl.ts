import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import axios from "axios";
import { NextResponse } from "next/server";
import { config } from "process";
import { db } from "./db";
import { wait } from "./utils";

const PTERODACTYL_API_KEY = process.env.PTERODACTYL_API_KEY;
const PTERODACTYL_API_URL = process.env.PTERODACTYL_API_URL;
const PTERODACTYL_CLIENT_API_KEY =
  process.env.PTERODACTYL_CLIENT_API_KEY;
const PTERODACTYL_CLIENT_API_URL =
  process.env.PTERODACTYL_CLIENT_API_URL;

export async function checkPterodactylUser(email: string) {
  const url = new URL(`${PTERODACTYL_API_URL}/users`);
  url.searchParams.append("filter[email]", email);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${PTERODACTYL_API_KEY}`,
    },
  });
  const data = await res.json();

  return data.data.length > 0 ? data.data[0] : null;
}

export async function checkOrCreatePterodactylUser(email: any) {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new Error("Nincs bejelentkezve!");
  }

  const pterouser = await checkPterodactylUser(email);
  if (pterouser) {
    return pterouser;
  }

  const password = crypto.randomBytes(16).toString("hex");
  const username = email.split("@")[0];

  const res = await fetch(`${PTERODACTYL_API_URL}/users`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PTERODACTYL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      first_name: session?.user?.name?.split(" ")[0],
      last_name: session?.user?.name?.split(" ")[1],
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Hiba a felhasználó létrehozásakor:", data);
    throw new Error(data.message || "Nem sikerült létrehozni a felhasználót!");
  }

  return data;
}

export async function createPterodactylServer(
  userId: string,
  serviceId: string,
  serviceName: string,
  configData: any,
  other: any,
  price: number
) {
  let eggId = other.eggId;
  let nestId = other.nestId;
  let nodeId = other.nodeId;
  let variables = other.variables;

  if (Number(serviceId) === 30) {
    if (configData.backend === "NodeJs") {
      eggId = other.variables.nodejs.id;
      variables = other.variables.nodejs.variables;
    } else if (
      configData.backend ===
      "Python"
    ) {
      eggId = other.variables.python.id;
      variables = other.variables.python.variables;
    }
  }

  let info = await getEggInfo(nestId, eggId);

  const serverData = {
    name: serviceName,
    user: userId,
    egg: eggId,
    docker_image: info.egg.docker_image,
    startup: info.egg.startup,
    limits: {
      memory: configData.ram,
      disk: configData.disk,
      cpu: configData.cpu,
      swap: 0,
      io: 500,
    },
    feature_limits: {
      databases: 4,
      allocations: 1,
      backups: 5,
    },
    allocation: {
      default: nodeId,
    },
    deploy: {
      locations: [1],
      dedicated_ip: false,
      port_range: [],
    },
    environment: variables,
  };

  try {
    const response = await axios.post<{ attributes: { identifier: string; id: string } }>(
      `${PTERODACTYL_API_URL}/servers`,
      serverData,
      {
        headers: {
          Authorization: `Bearer ${PTERODACTYL_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    

    if (response.status === 201) {
      return {
        pterodactyl_id: response.data.attributes.identifier,
        panel_id: response.data.attributes.id,

        success: true,
        message: "Szerver létrehozva sikeresen!",
      };
    } else {
      return {
        success: false,
        message: "Szerver létrehozása sikertelen!",
      };
    }
  } catch (error) { 
    return {
      success: false,
      message: "Hiba történt a kérés feldolgozása során.",
    };
  }
}

export async function getEggInfo(nestId: string, eggId: string) {
  const apiKey = process.env.PTERODACTYL_API_KEY;
  const apiUrl = process.env.PTERODACTYL_API_URL;

  try {
    const response = await axios.get<{ attributes: any }>(
      `${apiUrl}/nests/${nestId}/eggs/${eggId}`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return {
      message: "Szerver adatai sikeresen lekérve.",
      egg: response.data.attributes,
    };
  } catch (error) {
    return {
      error_message: "Váratlan hiba történt",
    };
  }
}
export async function getPterodactylServerResourceUsage(
  pterodactyl_id: string
) {
  const apiKey = process.env.PTERODACTYL_CLIENT_API_KEY;
  const apiUrl = process.env.PTERODACTYL_API_CLIENT_URL;

  if (!apiKey || !apiUrl) {
    throw new Error("Pterodactyl API configuration is missing");
  }

  try {
    const res = await axios.get(
      `${apiUrl}/servers/${pterodactyl_id}/resources`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.errors?.[0]?.detail ||
      error.response?.data?.error ||
      "Failed to fetch server resources"
    );
  }
}
export async function changePterodactylPowerState(
  pterodactyl_id: string,
  powerState: string
) {
  const apiKey = process.env.PTERODACTYL_CLIENT_API_KEY;
  const apiUrl = process.env.PTERODACTYL_API_CLIENT_URL;

  if (!apiKey || !apiUrl) {
    throw new Error("Pterodactyl API configuration is missing");
  }

  try {
    const res = await axios.post(
      `${apiUrl}/servers/${pterodactyl_id}/power`,
      {
        signal: powerState,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return res.data;
  } catch (error: any) {
    console.error("Pterodactyl API Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });

    throw new Error(
      error.response?.data?.errors?.[0]?.detail ||
      error.response?.data?.error ||
      "Failed to fetch server resources"
    );
  }
}

export async function checkAndUpdateStatus(pteroId: string, serviceId: string) {
  let maxAttempts = 10;

  for (let i = 0; i < maxAttempts; i++) {
    const status = await getPterodactylServerStatus(pteroId);

    if (status === "running") {
      await db.service.update({
        where: { id: Number(serviceId) },
        data: { status: "active" },
      });
      break;
    } else if (status === "offline") {
      await db.service.update({
        where: { id: Number(serviceId) },
        data: { status: "offline" },
      });
      break;
    } else if (status === "starting") {
      await db.service.update({
        where: { id: Number(serviceId) },
        data: { status: "starting" },
      });
      break;
    }

    await wait(5000);
  }
}


export async function getPterodactylServerInfo(pterodactyl_id: string) {
  const apiKey = process.env.PTERODACTYL_CLIENT_API_KEY;
  const apiUrl = process.env.PTERODACTYL_API_CLIENT_URL;

  if (!apiKey || !apiUrl) {
    throw new Error("Pterodactyl API configuration is missing");
  }
  try {
    const res = await axios.get(`${apiUrl}/servers/${pterodactyl_id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.errors?.[0]?.detail ||
      error.response?.data?.error ||
      "Failed to fetch server resources"
    );
  }
}

export async function getPterodactylServerStatus(serverId: string) {
  try{
    // console.log("serverId", serverId);
    const apiKey = process.env.PTERODACTYL_CLIENT_API_KEY;
    const apiUrl = process.env.PTERODACTYL_API_CLIENT_URL;

    const res = await fetch(`${apiUrl}/servers/${serverId}/resources`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const json = await res.json();
    return json?.attributes?.current_state; 
  } catch (error) {
    console.error("Error fetching server status:", error);
    throw error;
  }
}

async function getServerDetails(pterodactyl_id: string) {
    const apiKey = process.env.PTERODACTYL_API_KEY;
    const apiUrl = process.env.PTERODACTYL_API_URL;

    try {
      const response = await axios.get(`${apiUrl}/servers/${pterodactyl_id}`, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        return {
            message: "Szerver adatai sikeresen lekérve.",
            server: (response.data as any).attributes,
        };
    } catch (error) {
        return {
            error_message: "Váratlan hiba történt"
        }
    }
}

/**
 * Frissíti a szolgáltatás konfigurációját a Pterodactyl szerveren.
 * @param {string} panel_id A Pterodactyl szerver azonosítója.
 * @param {Object} vpsConfiguration A frissítendő konfigurációs adatok.
 * @returns {Promise<Object>} A Pterodactyl API válasza a frissítésről.
 * @throws {Error} Ha a Pterodactyl API konfigurációja hiányzik, vagy a frissítés sikertelen.
 */
export async function updateServiceConfiguration(
  panel_id: string,
  vpsConfiguration: any
) {
  const apiKey = process.env.PTERODACTYL_API_KEY;
  const apiUrl = process.env.PTERODACTYL_API_URL;

  if (!apiKey || !apiUrl) {
    throw new Error("Pterodactyl API configuration is missing");
  }

  try {
    const serverDetailsRequest = await getServerDetails(panel_id);
    const server = serverDetailsRequest.server;

    const payload = {
      allocation: server.allocation,
      memory: vpsConfiguration.ram,
      swap: vpsConfiguration.swap ?? 0,
      disk: vpsConfiguration.disk,
      io: vpsConfiguration.io ?? 500,
      cpu: vpsConfiguration.cpu ?? 100,
      feature_limits: {
        databases: vpsConfiguration.databases ?? server.feature_limits.databases,
        backups: vpsConfiguration.backups ?? server.feature_limits.backups,
        allocations: vpsConfiguration.allocations ?? server.feature_limits.allocations,
      },
    };

    const res = await axios.patch(
      `${apiUrl}/servers/${server.id}/build`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return {
      success: false,
      data: res.data
    };
  } catch (error: any) {
    console.error("Pterodactyl API Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    });

    let errorMessage = "Váratlan hiba történt a szerver konfigurálása során.";

    if (error.response?.data?.errors) {
      errorMessage = error.response.data.errors.map((err: any) => 
        err.detail || err.message || 'Ismeretlen hiba'
      ).join(', ');
    }

    return {
      success: false,
      error: errorMessage
    };
  }
}

export async function deletePterodactylServer(pterodactyl_id: string) {
  const apiKey = process.env.PTERODACTYL_API_KEY;
  const apiUrl = process.env.PTERODACTYL_API_URL;

  if (!apiKey || !apiUrl) {
    throw new Error("Pterodactyl API configuration is missing");
  }

  try {
    const response = await axios.delete(`${apiUrl}/servers/${pterodactyl_id}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    return {
      message: "Szerver sikeresen törölve.",
      data: response.data,
    };
  } catch (error) {
    return {
      error_message: "Váratlan hiba történt a szerver törölés során.",
    };
  }
}