/**
 * Librerie
 */
import {Base} from "./Base";
import {Application} from "./Application";

/**
 * Classe di gestione dei profili presenti nel Portale.
 */
export class Profile extends Base {

   /**
    * Getter
    */
   get name(): string {
      return this._document["name"];
   };
   get description(): string {
      return this._document["description"];
   };

   /**
    * Setter
    * @param value
    */
   set name(value: string) {
      this._document["name"] = value;
   };
   set description(value: string) {
      this._document["description"] = value;
   };

   /**
    * Restituisce l'indice dell'applicazione presente all'interno della lista di
    * quelle assegnate al profilo. Se non esiste viene restituito -1.
    * Il confronto viene fatto a parità di _id.
    * @param application
    * @private
    */
   private applicationAlreadyExists(application: Application): number {
      let result: number = -1;

      result = this._document["applications"].findIndex(d => d._id.equals(application._id));

      return result;
   };

   /**
    * Costruttore della classe.
    */
   constructor() {
      super();
      this._collection = this.getCollection("admin");
   };

   /**
    * Inizializza il documento per un nuovo profilo.
    */
   public new(): void {
      super.new("profile");
   };

   /**
    * Effettua controllo proprietà obbligatorie.
    */
   public check(): void {
      super.check();
      if(this.name === undefined || this.description === undefined)
         throw new Error("mandatory fields missing");
   };

   /**
    * Permette di accedere a un profilo tramite il suo nome.
    * @param name
    */
   public async loadByName(name: string): Promise<void> {
      let result: object[] = await this._select(this._collection, {"name": name});
      this._document = result[0];
   };

   /**
    * Aggiunge un'applicazione al profilo. Se l'applicazione è già presente non
    * viene aggiunta.
    * @param application
    */
   public addApplication(application: Application): void {
      // Aggiunge l'array delle applicazioni assegnate al profilo (solo se questa
      // proprietà non è già presente:
      if(this._document["applications"] === undefined)
         this._document["applications"] = [];

      // Se l'applicazione non è già stata inserita, procede al suo inserimento:
      if(this.applicationAlreadyExists(application) === -1)
         this._document["applications"].push({
            "_id": application._id
         });
   };

   /**
    * Permette di rimuovere un'applicazione dal profilo.
    * @param application
    */
   public removeApplication(application: Application): void {
      this._document["applications"] = this._document["applications"].filter(d => !d._id.equals(application._id));
   };

   /**
    * Disassegna tutte le applicazioni dal profilo.
    */
   public cleanApplication(): void {
      this._document["applications"] = [];
   };

   /**
    * Restituisce le applicazioni non ancora assegnate al profilo oppure tutte
    * con dettaglio se assegnate o meno.
    * @param status
    */
   public async getAvailableApplications(status: boolean = false): Promise<object[]> {
      let result: object[] = [];

      // Legge tutte le anagrafiche delle applicazioni (mantiene solo alcune proprietà):
      let available: object[] = await this._select(
         this._collection,
         {"type": "application"},
         {projection: {"_id": 1, "name": 1, "description": 1}}
      );

      // In base al valore del parametro "status" il metodo restituisce:
      // false: solo le applicazioni non ancora assegnate al profilo;
      // true: tutte le applicazioni con proprietà "status" uguale a false per quelle
      //       non assegnate e true per le altre;
      switch(status) {
         case false:
            available.forEach(a => {
               if(!this._document["applications"].some(d => d["_id"].equals(a["_id"])))
                  result.push(a);
            });
            break;

         default:
            available.forEach(a => {
               result.push({
                  "_id": a["_id"],
                  "name": a["name"],
                  "descriptions": a["description"],
                  "status": this._document["applications"].some(d => d["_id"].equals(a["_id"]))
               });
            });
      }

      return result;
   };

   /**
    * Verifica se il profilo è usato in un'anagrafica utente. Utile per gestire la
    * cancellazione fisica senza creare incoerenze nella base dati.
    */
   public async isUsed(): Promise<number> {
      return await this.count({"type": "user", "_id": this._id});
   };
 }