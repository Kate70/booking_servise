import { sendData, sendError } from "./send.js";
import fs from "node:fs/promises";
import { CLIENTS } from "../index.js";


export const updateClient = (req,res, segment)=>{
    let body = "";
    const ticketNumber = segment[1]
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
           const updateDataClient = JSON.parse(body);
           
           if(
            !updateDataClient.fullName||
            !updateDataClient.phone||
            !updateDataClient.ticketNumber||
            !updateDataClient.booking
           ){
           
            sendError(res, 400, "Incorrect body");
            return;
           }
           if(updateDataClient.booking && (!updateDataClient.booking.length||
            !Array.isArray(updateDataClient.booking) ||
            !updateDataClient.booking.every((item)=>item.comedian && item.time))){
                sendError(res, 400, "Incorrect body field booking");
                return;
            }
       
          const clientsData = await fs.readFile(CLIENTS, 'utf8');
          const clients = JSON.parse(clientsData);

          const clientIndex = clients.findIndex(
            (c)=>c.ticketNumber === ticketNumber
          );

          if(clientIndex ===-1){
            sendError(res, 404, "Client doesn't exist")
          }
        clients[clientIndex]= {
            ...clients[clientIndex],
            ...updateDataClient
        }  
      
         
          await fs.writeFile(CLIENTS, JSON.stringify(clients))
           sendData(res, updateDataClient)
        }catch(error){
            console.error(`error; ${error}`);
            sendError(res, 500, "Server error...")
        }
    });
}