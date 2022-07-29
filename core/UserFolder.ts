/**
 * Librerie
 */
import {ObjectId} from "mongodb";
import {Base} from "./Base";
import {User} from "./User";
import {Application} from "./Application";
import {Profile} from "./Profile";
import {application} from "express";


/**
 * Classe di gestione dei folder utente per l'organizzazione delle applicazioni.
 */
export class UserFolder extends Base {

   /**
    * Costruttore della classe.
    */
   constructor() {
      super();
      this._collection = this.getCollection("admin");
   };

   /**
    * Carica il documento contenitore dei folder definiti dell'utente.
    * @param user
    */
   public async loadByUser(user: User): Promise<void> {
      // Legge contenitore con i folder definiti dall'utente:
      this._document = (await this._select(
         this._collection,
         {"type": "folder", "email": user.email},
      ))[0];

      // Non esiste il contenitore dei folder utente:
      if(this._document === undefined)
         this._document = {
            "type": "folder",
            "email": user.email
         };
   };

   /**
    * Aggiunge un folder al contenitore utente.
    * @param name
    * @param description
    */
   public createFolder(name: string, description: string): void {
      if(this._document !== undefined && this._document[name] === undefined)
         this._document[name] = {
            "description": description,
            "applications": []
         };
   };

   /**
    * Aggiunge un'applicazione al folder definito dall'utente.
    * @param name
    * @param application
    */
   public addApplicationToFolder(name, application: Application): void {
      let index: number = -1

      if(this._document[name] !== undefined) {
         index = this._document[name]["applications"].findIndex(d => new ObjectId(d).equals(application._id));
         if(index === -1)
            this._document[name]["applications"].push(application._id);
      }
   };

   /**
    * Elimina l'applicazione dal folder definito dall'utente.
    * @param name
    * @param application
    */
   public removeApplicationFromFolder(name, application: Application): void {
      if(this._document[name] !== undefined)
         this._document[name]["applications"] = this._document[name]["applications"].filter(d => !new ObjectId(d).equals(application._id));
   };

   /**
    * Restituisce il folder.
    * @param name
    */
   public getFolder(name: string): object {
      return this._document[name] === undefined ? {} : this._document[name];
   };

   /**
    * Costruisce una lista di folder con le relative applicazioni assegnate in coerenza
    * con il profilo utente. Tutte le applicazioni non assegnate ad un folder sono inserite
    * nel folder generico.
    * @param profile
    */
   public async getX(profile: Profile): Promise<object[]> {
      let folders: object[] = [];
      let hub_folders: object[] = [];
      let folder: object = {};
      let hub_folder: object = {};
      let index: number = -1;

      // Legge tutte le anagrafiche delle applicazioni.
      let applications = await this._select(
         this._collection,
         {"type": "application", "locked": false}
      );

      // Prepara lista dei folder con le proprie applicazioni assegnate. Tutte quelle
      // non assegnate sono inserite nel folder generico.
      Object.keys(this._document).forEach(d => {
         switch(d) {
            case "_id":
            case "type":
            case "email":
            case "locked":
            case "created_at":
            case "changed_at":
               break;

            // Le applicazioni assegnate vengono rimosse dall'elenco delle applicazioni così
            // che si possa popolare il folder generico:
            default:
               folder = this.getFolder(d);
               hub_folder = {
                  "name": d,
                  "description": folder["description"],
                  "applications": []
               };
               folder["applications"].forEach(f => {
                  index = applications.findIndex(a => a["_id"].equals(f));
                  if(index != -1)
                     hub_folder["applications"].push(applications[index]);
                  applications = applications.filter(a => !a["_id"].equals(f));
               });
               hub_folders.push(hub_folder);
         }
      });

      // Popola folder generico:
      hub_folder = {
         "name": "generic",
         "description": "",
         "applications": []
      };
      applications.forEach(a => {
         hub_folder["applications"].push(a);
      });
      hub_folders.push(hub_folder);

      return hub_folders;
   };
}