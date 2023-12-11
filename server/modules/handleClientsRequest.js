import { CLIENTS } from "../index.js";
import { sendData, sendError } from "./send.js";
import fs from "node:fs/promises";

export const handleClientsRequest = async(req, res, ticketNumber) => {
try{
    const clienData = await fs.readFile(CLIENTS, 'utf-8');
    const clients = JSON.parse(clienData);
    const client = clients.find((c)=> c.ticketNumber === ticketNumber);
    if (!client){
        sendError(res, 404, "No client with such ticket!");
        return;
    }
    sendData(res, client)

}catch(err){
    console.error(err);
    sendError(res, 500, "Server error...")
}
}