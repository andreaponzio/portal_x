/**
 * Librerie
 */
import express from "express";
import session from "express-session";
import {engine} from "express-handlebars";
import * as winston from "winston";

import {Base} from "./core/Base";

/**
 * File dati
 */
import {nodejs} from "./public/config.json";

/**
 * Moduli aggiuntivi
 */

/**
 * Inizializza applicazione
 */
const app: express.Application = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine('.hbs', engine({
   extname: ".hbs",
   helpers: {}
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
 * Inizializza logger
 */
const logger: winston.Logger = winston.createLogger({
   format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
   ),
   transports: [
      new winston.transports.File({filename: "historical.log"}),
   ],
});

/**
 * Middleware
 */

/**
 * Routing
 */
app.use("/", async (request, response) => {

});

/**
 * Avvia server dipendente dalla riuscita della connessione
 * alla base dati
 */
import {User} from "./core/User";
import * as mongoDB from "mongodb";

Base.connection().then(() => {
   //app.listen(nodejs.port);

   (async() => {

      let u = new User();
      try {
         /*u.new();
         u.email = "andrea.ponzio@gmail.com";
         u.name = "andrea";
         u.password = u.security = "123456";
         u.check();
         await u.save();*/
         //console.log(u.password);
         await u.loadByEmail("andrea.ponzio@gmail.com");
         u.locked = true;
         await u.save();
         console.log(u.document);
      }
      catch(ex) {
         console.log(ex);
      }

   })().catch(error => {
      console.log(error);
   });


}).catch(error => {
}).finally(() => {
})