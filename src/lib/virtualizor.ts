import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import axios from "axios";
import crypto from "crypto";
import { sendVirtualizorRegistrationEmail } from "./email";
import { headers } from "next/headers";

const virtualizorApiURL = "http://37.221.214.105:2005";

export async function checkVirtualizorUser(email: string) {
  const url = new URL(`${virtualizorApiURL}/getUsers.php`);
  url.searchParams.append("email", email);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error("Error:", response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data?.users && Object.keys(data.users).length > 0) {
      const user = Object.values(data.users)[0];

      return {
        status: "success",
        message: "User found.",
        data: user,
      };
    } else {
      return {
        status: "error",
        message: "No user found with the given email.",
      };
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function checkOrCreateVirtualiozorUser(email: string) {
  const session = await getServerSession(authOptions);
  const virtualizoruser = await checkVirtualizorUser(email);

  try {
    if (!session) {
      throw new Error("Nincs bejelentkezve!");
    }

    if (virtualizoruser?.status === "success") {
      return virtualizoruser;
    }

    const newpass = crypto.randomBytes(16).toString("hex");
    const fname = session.user.name?.split(" ")[0] ?? "";
    const lname = session.user.name?.split(" ")[1] ?? "";
    const title = "Fiók létrehzása";
    interface CreateUserResponse {
      data: {
        error?: any[];
      };
      data2: {
        users: Record<string, any>;
      };
    }

    let newData = JSON.stringify({
      newemail: email,
      fname: fname,
      lname: lname,
      newpass: newpass,
    });

    const createUserResponse = await axios
      .post<CreateUserResponse>(
        `${virtualizorApiURL}/createUser.php`,
        newData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        return response.data;
      });

    await sendVirtualizorRegistrationEmail(title, email, fname, lname, newpass);

    return {
      status: "success",
      message: "User created successfully.",
    };
  } catch (error) {
    console.error("Error in checkOrCreateVirtualiozorUser:", error);
    return {
      error_message: "Váratlan hiba történt",
    };
  }
}

let osids = [
  { osid: 1083, name: "AlmaLinux 8.9 (x86_64)" },
  { osid: 1115, name: "AlmaLinux 9.4 (x86_64)" },
  { osid: 963, name: "CentOS 7.9 (x86_64)" },
  { osid: 1102, name: "CentOS 8.9 (x86_64)" },
  { osid: 881, name: "Debian 10 (x86_64)" },
  { osid: 983, name: "Debian 11 (x86_64)" },
  { osid: 1057, name: "Debian 12 (x86_64)" },
  { osid: 913, name: "Ubuntu 20.04 (x86_64)" },
  { osid: 1021, name: "Ubuntu 22.04 (x86_64)" },
  { osid: 1110, name: "Ubuntu 24.04 (x86_64)" },
  { osid: 1121, name: "Windows 2022 (SCSI VirtIO)" },
];

export async function createVirtualizorServer(
  serverId: string,
  userId: string,
  userEmail: string,
  osId: string,
  hostname: string,
  rootPassword: string,
  storageId: string,
  storageLimit: number,
  storageUUID: string,
  ram: number,
  cpu: number
) {
  try {
    console.log('Creating Virtualizor server with params:', {
      server_id: serverId,
      user_id: userId,
      user_email: userEmail,
      osid: osids.find((item) => item.name === osId)?.osid || 0,
      hostname: hostname,
      storage_id: storageId,
      storage_limit: storageLimit / 1024,
      storage_uuid: storageUUID,
      ram: ram,
      core: cpu
    });

    const response = await axios.post(
      `${virtualizorApiURL}/createVPS.php`,
      {
        server_id: serverId,
        user_id: userId,
        user_email: userEmail,
        osid: osids.find((item) => item.name === osId)?.osid || 0,
        hostname: hostname,
        root_password: rootPassword,
        storage_id: storageId,
        storage_limit: storageLimit / 1024,
        storage_uuid: storageUUID,
        ram: ram,
        core: cpu,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log('Virtualizor server creation response:', response.data);
    return {
      status: "success",
      message: "Server created successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Error creating Virtualizor server:", error);
    return { status: "error", message: "Failed to create server" };
  }
}