/**
 * Librerie
 */
import express from "express";
import session from "express-session";
import {engine} from "express-handlebars";

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
import {UserFolder} from "./core/UserFolder";
import {User} from "./core/User";
import {Application} from "./core/Application";
import {ObjectId} from "mongodb";
import {Base} from "./core/Base";
import {Profile} from "./core/Profile";

app.use("/", async(request, response) => {

});

/**
 * Avvia server dipendente dalla riuscita della connessione
 * alla base dati
 */
//app.listen(nodejs.port);

//
//
//
//
(async() => {
   await Base.connection();

   let u = new User();
   u.new();
   u.name = "andrea";
   u.email = "aa@aa.com";

   let p = new Profile();
   await p.load(new ObjectId("62e3d42732d1a52292de519f"));

   /*let a = new Application();
   let b = new Application();
   await a.load(new ObjectId("62e3cc9de6dd893cb8c2cd1e"));
   await b.load(new ObjectId("62e3cc9de6dd893cb8c2cd1a"));*/

   let f = new UserFolder();
   await f.loadByUser(u);
   await f.getX(p);
})().catch(error => {
   console.log(error);
});