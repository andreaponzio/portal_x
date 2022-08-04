/**
 * Librerie
 */
import express from "express";
import session from "express-session";
import {engine} from "express-handlebars";
import methodOverride from "method-override";

const helpers = require("handlebars-helpers")();
const flash = require("connect-flash");

/**
 * Definizioni di routing.
 */
import {router as routeSignup} from "./routers/routeSignup";

/**
 * File dati
 */
import {nodejs} from "./public/config.json";

/**
 * Inizializza applicazione
 */
const app: express.Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('.hbs', engine({
   extname: ".hbs",
   helpers
}));
app.set("view engine", ".hbs");
app.use(session({
   cookie: {
      maxAge: 60 * 60 * 1000
   },
   secret: "SarahConnor",
   resave: false,
   saveUninitialized: false
}));

/**
 * Middleware
 */
app.use(methodOverride((request: express.Request, response: express.Response) => {
   if(request.body && typeof request.body === "object" && "_method" in request.body) {
      let method = request.body._method;
      delete request.body._method;
      return method;
   }
}));
app.use(flash());

/*app.all("*", async(request, response, next) => {
   // Rende disponibile la sessione all'interno della pagina per handlebars:
   response.locals.session = request.session;
   next();
});*/

/**
 * Routing. In base alla modalità presente nel file di configurazione,
 * il Portale si comporta come:
 * 0 = funzionamento regolare;
 * 1 = Portale in manutenzione;
 */
switch(nodejs.mode) {
   case 0:
      app.use("/signup", routeSignup);
      break;

   case 1:
      app.use("/", (request:express.Request, response:express.Response) => {
         response.send("Il Portale dell'utente è in manutenzione.");
      });
      break;
}

/**
 * Avvia server dipendente dalla riuscita della connessione
 * alla base dati
 */
app.listen(nodejs.port);