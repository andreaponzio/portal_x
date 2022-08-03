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
import {Initialize} from "./core/Initialize";
import {SapSystem} from "./core/SapSystem";
import {MySap} from "./core/MySap";

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

})().catch(error => {
   console.log(error);
});