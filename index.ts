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
import {Application} from "./core/Application";
import {Profile} from "./core/Profile";
import * as mongoDB from "mongodb";

Base.connection().then(() => {
   //app.listen(nodejs.port);

   (async() => {

      let a = new Application();
      let aa = new Application();
      let p = new Profile();
      try {
         await a.load(new mongoDB.ObjectId("62e39797144b499c666a9e03"));
         await aa.load(new mongoDB.ObjectId("62e3981f8bc766bc0a87f139"));

         /*a.new();
         a.name = "app3";
         a.description = "applicazione 3";
         await a.save();*/

         /*p.new();
         p.name = "profilo";
         p.description = "profilo di prova";
         p.addApplication(a);
         p.addApplication(aa);
         await p.save();*/

         await p.load(new mongoDB.ObjectId("62e3987955ef8460c8810da0"));
         console.log(await p.getAvailableApplications(true));

         //console.log(p.document);
      }
      catch(ex) {
         console.log(ex);
      }

   })().catch(error => {
      console.log(error);
   });


}).catch(error => {
   console.log(error);
}).finally(() => {
})