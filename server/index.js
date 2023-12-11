import http from "node:http";
import fs from "node:fs/promises";
import { sendData, sendError } from "./modules/send.js";
import { checkFile } from "./modules/checkFile.js";
import { handleComediansRequest } from "./modules/handleComediansRequest.js";
import { handleAddClient } from "./modules/handleAddClient.js";
import {handleClientsRequest} from "./modules/handleClientsRequest.js";
import { updateClient } from "./modules/updateClient.js";


const port = 8080;
const COMEDIANS = "./comedians.json";
export const CLIENTS = "./clients.json";




const startServer = async () => {
  
  if (!(await checkFile(COMEDIANS))) {
    console.log(6);
    //return;
  }
  await checkFile(CLIENTS, true);
  const comediansData = await fs.readFile(COMEDIANS, "utf-8");
  const comedians = JSON.parse(comediansData)
  http
    .createServer(async (req, res) => {
       
      try {
        res.setHeader("Access-Control-Allow-Origin", "*")

        const segment = req.url.split("/").filter(Boolean);
        console.log(segment);
        if (req.method === "GET" && segment[0] === "comedians") {
        handleComediansRequest(req, res, comedians, segment)
          return;
        }
        if (req.method === "POST" && segment[0] === "clients") {
            handleAddClient(req, res)
            return;
        }
        if (
          //GET/clients/:ticketNumber
          req.method === "GET" &&
          segment[0] === "clients" &&
          segment.length === 2
        ) {
            const ticketNumber =segment[1]
            handleClientsRequest(req, res, ticketNumber);
            return
        }
        if (
          req.method === "PATCH" &&
          segment[0] === "clients" &&
          segment.length === 2
        ) {
          updateClient(req,res,segment)
            return;
        }
        sendError(res, 404, "Not found");
      } catch (err) {
        sendError(res, 500, `Server error ${err}`);
      }
      // res.writeHead(200, {
      //     "Content-Type":"text/plain; charset=utf-8",
      //     "Access-Control-Allow-Origin": "*"
      // })
      // res.end("ello")
    })
    .listen(port);
  console.log(`Server starts in ${port}`);
};

startServer();

//console.log(`server run on port ${port}` );
