/**
 * Librerie
 */
import * as mongoDB from "mongodb";
import {Base} from "./Base";
import {Application} from "./Application";
import {Profile} from "./Profile";
import {User} from "./User";
import {raw} from "express";

/**
 * File dati
 */

/**
 * Permette d'inizializzare una base dati MongoDB da zero per la
 * gestione del Portale.
 */
export class Initialize {
   private base: Base;

   public static async init(): Promise<void> {
      await Base.connection();

      let a = new Application();

      /*a.new();
      a.name = "finalize-user";
      a.description = "Finalizzazione registrazione"
      a.position = 1;
      await a.save();

      a.new();
      a.name = "master-application";
      a.description = "Anagrafica delle applicazioni"
      a.position = 1;
      await a.save();

      a.new();
      a.name = "master-profile";
      a.description = "Anagrafica dei profili"
      a.position = 2;
      await a.save();

      a.new();
      a.name = "master-user";
      a.description = "Anagrafica degli utenti"
      a.position = 3;
      await a.save();

      a.new();
      a.name = "master-sapsys";
      a.description = "Anagrafica dei sistemi SAP"
      a.position = 4;
      await a.save();

      a.new();
      a.name = "chat";
      a.description = "Comunicare con altri utenti"
      a.position = 2;
      await a.save();

      a.new();
      a.name = "mysap";
      a.description = "I Miei sistemi SAP";
      a.position = 3;
      await a.save();*/

      let p = new Profile();
      p.new();
      p.cleanApplication();
      p.name = "finalize-user";
      p.description = "Profilo per finalizzazione registrazione";
      await a.load(new mongoDB.ObjectId("62e3cc9de6dd893cb8c2cd1a")); p.addApplication(a);
      await p.save();

      p.new();
      p.cleanApplication();
      p.name = "admin";
      p.description = "Profilo amministrativo";
      await a.load(new mongoDB.ObjectId("62e3cc9de6dd893cb8c2cd1b")); p.addApplication(a);
      await a.load(new mongoDB.ObjectId("62e3cc9de6dd893cb8c2cd1c")); p.addApplication(a);
      await a.load(new mongoDB.ObjectId("62e3cc9de6dd893cb8c2cd1d")); p.addApplication(a);
      await a.load(new mongoDB.ObjectId("62e3cc9de6dd893cb8c2cd1e")); p.addApplication(a);
      await p.save();

      p.new();
      p.cleanApplication();
      p.name = "sap-complete";
      p.description = "Profilo SAP completo";
      await a.load(new mongoDB.ObjectId("62e3cc9de6dd893cb8c2cd1f")); p.addApplication(a);
      await a.load(new mongoDB.ObjectId("62e3cc9de6dd893cb8c2cd20")); p.addApplication(a);
      await p.save();
   };
}
