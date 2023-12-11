import fs from "node:fs/promises";
import { sendData, sendError } from "./send.js";

export const handleComediansRequest = async (req, res, comedians, segment) => {
  if (segment.length === 2) {
    const comedian = comedians.find((c) => c.id === segment[1]);
    console.log(comedian);
    if (!comedian) {
      sendError(res, 404, "Comidiant doesn't found");
      return;
    }
    sendData(res, comedian);
    return;
  }
  sendData(res, comedians);
};
