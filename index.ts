/**
 * Librerie
 */
import express from "express";
import session from "express-session";
import {engine} from "express-handlebars";
import methodOverride from "method-override";
import {Base} from "./core/Base";
/**
 * Definizioni di routing.
 */
import {router as routeHub} from "./routers/routeHub";
import {router as routeSignup} from "./routers/routeSignup";
import {router as routeSignupManage} from "./routers/routeSignupManage";
import {router as routeQuestion} from "./routers/routeQuestion";

/**
 * File dati
 */
import {nodejs} from "./public/config.json";

const helpers = require("handlebars-helpers")();
const flash = require("connect-flash");

/**
 * Inizializza applicazione
 */
const app: express.Application = express();
app.use(express.urlencoded({extended: true}));
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
app.use("/js", express.static(__dirname + "/views"));

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

/**
 * Middleware per verifica della connessione alla base dati.
 */
app.all("*", async(request: express.Request, response: express.Response, next: express.NextFunction) => {
   let ping: object = {};

   try {
      await Base.connection();
      ping = await Base.ping();
      if(ping["ok"] !== 1)
         response.send("Connessione alla base dati impossibile.<br>Contattare l'amministratore.");
      next();
   }
   catch(ex) {
      response.send("Connessione alla base dati impossibile.<br>Contattare l'amministratore.");
   }
});

/**
 * Routing. In base alla modalità presente nel file di configurazione,
 * il Portale si comporta come:
 * 0 = funzionamento regolare;
 * 1 = Portale in manutenzione;
 */
switch(nodejs.mode) {
   case 0:
      app.use("/", routeHub);
      app.use("/signup", routeSignup);
      app.use("/signup_manage", routeSignupManage);
      app.use("/question", routeQuestion);
      break;

   case 1:
      app.use("/", (request: express.Request, response: express.Response) => {
         response.send("Il Portale dell'utente è in manutenzione.");
      });
      break;
}

/**
 * Avvia server dipendente dalla riuscita della connessione
 * alla base dati
 */
app.listen(nodejs.port);