/**
 * Librerie
 */
import {Base} from "./Base";
import {Application} from "./Application";
import {Profile} from "./Profile";
import {User} from "./User";

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

      let a_fu = new Application();
      let a_ma = new Application();
      let a_mp = new Application();
      let a_mu = new Application();
      let a_chat = new Application();
      let a_sapsys = new Application();
      let a_mysap = new Application();

      let p_fu = new Profile();
      let p_admin = new Profile();
      let p_sap = new Profile();
      let p_generic = new Profile();

      let u_admin = new User();
      let u_my = new User();

      a_fu.new();
      a_fu.name = "finalize-user";
      a_fu.description = "Completa la registrazione al Portale";
      await a_fu.save();

      a_ma.new();
      a_ma.name = "master-application";
      a_ma.description = "Anagrafica applicazioni";
      await a_ma.save();

      a_mp.new();
      a_mp.name = "master-profile";
      a_mp.description = "Anagrafica profili";
      await a_mp.save();

      a_mu.new();
      a_mu.name = "master-user";
      a_mu.description = "Anagrafica utenti";
      await a_mu.save();

      a_chat.new();
      a_chat.name = "char";
      a_chat.description = "Comunica con altri utenti";
      await a_chat.save();

      a_sapsys.new();
      a_sapsys.name = "master-sapsys";
      a_sapsys.description = "Anagrafica sistemi SAP";
      await a_sapsys.save();

      a_mysap.new();
      a_mysap.name = "mysap";
      a_mysap.description = "I miei sistemi SAP";
      await a_mysap.save();

      p_fu.new();
      p_fu.name = "finalize-user";
      p_fu.description = "Completa la registrazione al Portale";
      p_fu.addApplication(a_fu);
      await p_fu.save();

      p_admin.new();
      p_admin.name = "admin";
      p_admin.description = "Amministratore";
      p_admin.addApplication(a_ma);
      p_admin.addApplication(a_mp);
      p_admin.addApplication(a_mu);
      p_admin.addApplication(a_chat);
      await p_admin.save();

      p_sap.new();
      p_sap.name = "sap";
      p_sap.description = "SAP completo";
      p_sap.addApplication(a_sapsys);
      p_sap.addApplication(a_mysap);
      p_admin.addApplication(a_chat);
      await p_sap.save();

      p_generic.new();
      p_generic.name = "generic";
      p_generic.description = "Generico";
      p_generic.addApplication(a_chat);
      await p_generic.save();

      u_admin.new();
      u_admin.name = "administrator";
      u_admin.email = "admin@localhost";
      u_admin.password = "Portal@1user";
      u_admin.security = "Portal@1user";
      u_admin.profile = p_admin._id;
      await u_admin.save();

      u_my.new();
      u_my.name = "Andrea";
      u_my.email = "andrea.ponzio@gmail.com";
      u_my.password = "Skynet";
      u_my.security = "Skynet";
      u_my.profile = p_admin._id;
      await u_my.save();
   };
}

/*
import {User} from "./core/User";
(async() => {
   await Base.connection();
   await User.suspend("utente@utente.com");
})().catch(error => {
   console.log(error);
});
 */
