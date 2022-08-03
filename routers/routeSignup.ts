/**
 * Librerie
 */
import express from "express";

/**
 * Inizializza router.
 */
export const router: express.Router = express.Router();

router.get("/", async(request: express.Request, response: express.Response) => {
   response.render("hub/signup", {
      "title": "Registrazione utente"
   });
});