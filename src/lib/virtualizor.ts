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
        const title = "Fiók létrehzása"
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
        })

        const createUserResponse = await axios.post<CreateUserResponse>(
            `${virtualizorApiURL}/createUser.php`,
            newData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        ).then((response) => {
            return response.data;
        });

        await sendVirtualizorRegistrationEmail(
            title,
            email,
            fname,
            lname,
            newpass
        );

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

export async function createVirtualizorServer() {
    
}