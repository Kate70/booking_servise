import { sendData, sendError } from "./send.js";
import fs from "node:fs/promises";

import { CLIENTS } from "../index.js";

export const handleAddClient = (req,res)=>{
    let body = "";
    try{
        req.on("data",(chunk)=>{
            body +=chunk;
        })
    }catch(error){
        console.log("Mistake reading req");
        sendError(res, 500, "Server mistake reading req")
     }
    req.on("end", async ()=>{
        try{        
           const newClient = JSON.parse(body);
           console.log(newClient);
          // sendData(res, newClient)
           if(
            !newClient.fullName||
            !newClient.phone||
            !newClient.ticketNumber||
            !newClient.booking
           ){
           
            sendError(res, 400, "Incorrect body");
            return;
           }
           if(newClient.booking && (!newClient.booking.length||
            !Array.isArray(newClient.booking) ||
            !newClient.booking.every((item)=>item.comedian && item.time))){
                sendError(res, 400, "Incorrect body field booking");
                return;
            }
        //    if(newClient.booking && (!Array.isArray(newClient.booking)||
        //     !newClient.booking.every((item)=>item.comedian && item.time))
        //    ){
        //     sendError(res, 400, "Incorrect booking fields");
        //     return;
        //    }
          const clientsData = await fs.readFile(CLIENTS, 'utf8');
          const clients = JSON.parse(clientsData);
      
          clients.push(newClient);
          await fs.writeFile(CLIENTS, JSON.stringify(clients))
           sendData(res, newClient)
        }catch(error){}
    })

}