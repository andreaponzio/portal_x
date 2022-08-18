/**
 * Librerie
 */
import express from "express";
import bcrypt from "bcrypt";
import * as genpwd from "generate-password";
import {User} from "../core/User";

/**
 * Inizializza router.
 */
export const router: express.Router = express.Router();

/**
 * Pagina principale per la gestione della propria utenza.
 */
router.get("/", (request: express.Request, response: express.Response) => {
   if(request.session["signup"] === undefined)
      request.session["signup"] = {
         "step": 1
      };

   response.render("hub/signup_manage", {
      "session": request.session,
      "title": "Gestione registrazione utente",
      "alert-success": request.flash("alert-success"),
      "alert-danger": request.flash("alert-danger")
   });
});

/**
 * Gestisce la navigazione tra i vari step. Inoltre, gestisce la modifica o
 * la sospensione della registrazione utente.
 */
router.post("/", async(request: express.Request, response: express.Response) => {
   let user: User;
   let regex: RegExp = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
   let newpwd: string;
   let step: number;
   let error: boolean = false;

   // Trasforma lo step in numero:
   step = parseInt(request.body._step);

   // In base allo step effettua i giusti controlli e operazioni:
   switch(step) {

      // Controllo validità email e frase di sicurezza:
      case 1:
         if(request.body.email.length === 0 || !regex.test(request.body.email)) {
            request.flash("alert-danger", "Indirizzo e-mail non valido");
            error = true;
         }
         else {
            user = new User();
            await user.loadByEmail(request.body.email);
            if(user.document === undefined) {
               request.flash("alert-danger", "Nessun utente risulta registrato con questa e-mail");
               error = true;
            }

            // Controlla correttezza della frase di sicurezza:
            else if(request.body.security.length === 0 || !bcrypt.compareSync(request.body.security, user.security)) {
               request.flash("alert-danger", "La frase di sicurezza non è corretta");
               error = true;
            }
         }
         request.session["signup"]["email"] = request.body.email;
         break;
   }

   // In base al comando scelto, torna allo step precedente oppure passa al successivo.
   // In caso di errori rimane allo step attuale così da permettere la correzione dei dati.
   if(!error) {
      switch(request.body._command) {
         case "back":
            step--;
            break;

         case "next":
            step++;
            break;

         case "reset":
            newpwd = genpwd.generate({length:15});
            user = new User();
            await user.loadByEmail(request.session["signup"]["email"]);
            if(user.document !== undefined) {
               user.password = newpwd;
               await user.save();
               request.flash("alert-success", `La nuova password è ${newpwd}`);
               step = 9;
            }
            break;

         case "suspend":
            user = new User();
            await user.loadByEmail(request.session["signup"]["email"]);
            if(user.document !== undefined) {
               user.locked = true;
               await user.save();
               request.flash("alert-success", "La registrazione è stata cancellata");
               step = 9;
            }
            break;
      }
      request.session["signup"]["step"] = step;
   }

   // Se l'operazione è terminata correttamente, riporto sull'HUB:
   if(step === 9)
      response.redirect("/");
   else
      response.redirect("/signup_manage");
});