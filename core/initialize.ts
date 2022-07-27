/**
 * Librerie
 */
import {Util} from "./Util";

/**
 * File dati
 */
import * as init_config from "../public/initialize_schema.json";
import * as winston from "winston";

/**
 * Permette d'inizializzare una base dati MongoDB da zero per la
 * gestione del Portale.
 */
export class Initialize extends Util {

   /**
    * Crea tutte le collezioni necessarie al funzionamento del Portale.
    */
   public static newCollection(logger: winston.Logger): void {
      init_config.collection.forEach(e => {
         Util.newCollection(logger, e);
      });
   };
}
