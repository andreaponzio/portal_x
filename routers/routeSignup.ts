/**
 * Librerie
 */
import express, {raw} from "express";
import {User} from "../core/User";

/**
 * Inizializza router.
 */
export const router: express.Router = express.Router();

/**
 * Pagina principale per la registrazione di un utente.
 */
router.get("/", (request: express.Request, response: express.Response) => {
   if(request.session["signup"] === undefined)
      request.session["signup"] = {
         "step": 1
      };

   response.render("hub/signup", {
      "session": request.session,
      "title": "Registrazione utente",
      "alert-success": request.flash("alert-success"),
      "alert-warning": request.flash("alert-warning"),
      "alert-danger": request.flash("alert-danger")
   });
});

/**
 * Gestisce la navigazione tra i vari step. Inoltre, gestire la registrazione
 * finale dell'utente nella base dati.
 */
router.post("/", async (request: express.Request, response: express.Response) => {
   let user: User;
   let regex: RegExp = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
   let step: number;
   let error: boolean = false;

   // Trasforma lo step in numero:
   step = parseInt(request.body._step);

   // In base allo step effettua i giusti controlli:
   switch(step) {

      // Controllo validità email e nome utente:
      case 1:
         if(request.body.email.length === 0 || !regex.test(request.body.email)) {
            request.flash("alert-danger", "Indirizzo e-mail non valido");
            error = true;
         } else if(request.body.username.length === 0) {
            request.flash("alert-danger", "Inserire un nome utente");
            error = true;
         }
         else {
            user = new User();
            await user.loadByEmail(request.body.email);
            if(user.document !== undefined) {
               request.flash("alert-danger", "Esiste già un utente con questa e-mail");
               error = true;
            }
            user = undefined;
         }
         request.session["signup"]["email"] = request.body.email;
         request.session["signup"]["username"] = request.body.username;
         break;

      // Verifica regole per password:
      // - lunghezza minima e massima;
      // - la ripetizione della password sia uguale alla prima;
      case 2:
         if(request.body.password.length < 1) {
            request.flash("alert-danger", "La password deve essere compresa tra 8 e 20 caratteri");
            error = true;
         } else if(request.body.password != request.body.repassword) {
            request.flash("alert-danger", "Le password non corrispondono");
            error = true;
         }
         request.session["signup"]["password"] = request.body.password;
         request.session["signup"]["repassword"] = request.body.repassword;
         break;

      // Verifica la frase di sicurezza:
      // - lunghezza minima e massima;
      // - la ripetizione della frase sia uguale alla prima;
      case 3:
         if(request.body.security.length < 1) {
            request.flash("alert-danger", "La frase di sicurezza deve essere compresa tra 15 e 40 caratteri");
            error = true;
         } else if(request.body.security != request.body.resecurity) {
            request.flash("alert-danger", "Le frasi di sicurezza non corrispondono");
            error = true;
         }
         request.session["signup"]["security"] = request.body.security;
         request.session["signup"]["resecurity"] = request.body.resecurity;
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

         case "save":
            user = new User();
            user.new();
            user.email = request.body.email;
            user.name = request.body.username;
            user.password = request.body.password;
            user.security = request.body.security;
            //await user.save();
            console.log(user.document);

            break;
      }
      request.session["signup"]["step"] = step;
   }
   response.redirect("/signup");
})
;