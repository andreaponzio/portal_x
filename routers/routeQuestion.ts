/**
 * Librerie
 */
import express from "express";
import {Question} from "../core/Question";

/**
 * Inizializza router.
 */
export const router: express.Router = express.Router();

/**
 * Pagina principale per l'invio di una comunicazione all'amministratore.
 */
router.get("/", (request: express.Request, response: express.Response) => {
   if(request.session["question"] === undefined)
      request.session["question"] = {};

   response.render("hub/question", {
      "session": request.session,
      "title": "Comunicazione all'amministratore",
      "alert-success": request.flash("alert-success"),
      "alert-danger": request.flash("alert-danger")
   });
});

/**
 * Gestisce i controlli e l'invio all'amministrazione del messaggio dall'esterno.
 */
router.post("/", async(request: express.Request, response: express.Response) => {
   let regex: RegExp = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
   let question: Question;
   let error: boolean = false;

   if(request.body.email.length === 0 || !regex.test(request.body.email)) {
      request.flash("alert-danger", "Indirizzo e-mail non valido");
      error = true;
   }
   else if(request.body.message.length === 0) {
      request.flash("alert-danger", "Inserire un messaggio");
      error = true;
   }
   request.session["question"]["email"] = request.body.email;
   request.session["question"]["message"] = request.body.message;

   if(error)
      response.redirect("/question");

      // Prepara il documento JSON da inserire direttamente nella
   // collezione delle chat:
   else {
      question = new Question();
      question.new();
      question.email = request.session["question"]["email"];
      question.title = request.session["question"]["message"].substring(1, 20);
      question.message = request.session["question"]["message"];
      await question.save();
      request.flash("alert-success", `Identificativo richiesta: ${question._id}`);
      response.redirect("/");
   }
});