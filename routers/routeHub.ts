/**
 * Librerie
 */
import express from "express";

/**
 * File dati
 */

/**
 * Inizializza router.
 */
export const router: express.Router = express.Router();

/**
 * Pagina dell'HUB principale. Se non è stata effettuata un'autenticazione, rimanda alla
 * pagine del login.
 */
router.get("/", async(request: express.Request, response: express.Response) => {
   // Pulisce dalla sessione le voci non più utili:
   delete request.session["signup"];

   //
   response.send("hub");
});