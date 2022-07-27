/**
 * Librerie
 */
import * as mongoDB from "mongodb";

/**
 * File dati
 */
import {mongodb as db_config} from "../public/config.json";

/**
 * Classe Base ha lo scopo di gestire tutte le comunicazioni con
 * la base dati. Questa classe è la genitore per tutte quelle classi
 * che dovranno interagire con la base dati.
 */
export class Base {

   // Proprietà protette:
   protected static client: mongoDB.MongoClient;
   protected static database: mongoDB.Db;

   // Proprietà protette comuni:
   protected _collection: mongoDB.Collection;
   protected _document: Object;

   /**
    * Permette d'inizializzare la connessione con la base dati. Se la connessione è
    * già attiva, esce senza fare nulla.
    */
   public static async connection(): Promise<void> {
      if(Base.client === undefined) {
         Base.client = new mongoDB.MongoClient(`mongodb://${db_config.server}:${db_config.port}`);
         await Base.client.connect();
         Base.database = Base.client.db(db_config.name);
      }
   };

   /**
    * Chiude la connessione.
    */
   public static async close(): Promise<void> {
      if(Base.client !== undefined)
         await Base.client.close();
      Base.client = undefined;
   }

   /**
    * Getter.
    */
   get document(): Object {
      return this._document;
   };
   get created_at(): Date {
      return this._document["created_at"];
   };
   get changed_at(): Date {
      return this._document["changed_at"];
   };
   get locked(): boolean {
      return this._document["locked"];
   };

   /**
    * Setter
    */
   set locked(value) {
      this._document["locked"] = value;
   };

   /**
    * Costruttore della classe base.
    */
   constructor() {
      this._document = {};
   };

   /**
    * Restituisce la collezione specificata. Bisogna ricordare che se
    * la collezione non esiste, alla prima operazione questa viene creata.
    * @param collectionName
    */
   protected getCollection(collectionName: string): mongoDB.Collection {
      return Base.database.collection(collectionName);
   };

   /**
    * Richiama metodo protetto convertendo il nome della collezione nel rispettivo riferimento.
    * @param collectionName
    * @param filter
    * @param options
    */
   public async select(collectionName: string, filter: object = {}, options: object = {}): Promise<object[]> {
      return await this._select(this.getCollection(collectionName), filter, options);
   };

   /**
    * Richiama metodo protetto convertendo il nome della collezione nel rispettivo riferimento.
    * @param collection
    * @param filter
    * @param options
    * @protected
    */
   protected async _select(collection:mongoDB.Collection, filter: object = {}, options: object = {}): Promise<object[]> {
      return await collection.find(filter, options).toArray();
   };

   /**
    * Richiama metodo protetto convertendo il nome della collezione nel rispettivo riferimento.
    * @param collectionName
    * @param lookup
    * @param match
    */
   public async join(collectionName: string, lookup: object | object[], match: object = {}) {
      return await this._join(this.getCollection(collectionName), lookup, match);
   };

   /**
    * Effettua un'istruzione JOIN tra più collezioni appartenenti alla stessa base dati, applicando se
    * necessario un condizione di filtro.
    * Esempio:
    * [
    *   {from: "<col1>", localField: "<keys>", foreignField: "<keys>", as: "<result1>"},
    *   {from:"<col2>", localField:"<keys>", foreignField:"<keys>", as:"<result2>"}
    * ]
    * @param collection
    * @param lookup
    * @param match
    * @protected
    */
   protected async _join(collection: mongoDB.Collection, lookup: object | object[], match: object = {}): Promise<object[]> {
      let pipeline: object[] = [];

      if(Array.isArray(lookup)) {
         lookup.forEach(d => {
            pipeline.push({
               "$lookup": d
            });
         });
      } else
         pipeline = [{
            "$lookup": lookup
         }];

      if(match !== {})
         pipeline["$match"] = match;

      return await collection.aggregate(pipeline).toArray();
   };

   /**
    * Richiama metodo protetto convertendo il nome della collezione nel rispettivo riferimento.
    * @param collectionName
    * @param filter
    */
   public async delete(collectionName: string, filter: object = {}): Promise<void> {
      await this._delete(this.getCollection(collectionName), filter);
   };

   /**
    * Elimina i documenti in base al filtro specificato. Se non viene impostato un filtro, saranno
    * eliminati tutti i documenti.
    * @param collection
    * @param filter
    */
   public async _delete(collection: mongoDB.Collection, filter: object = {}): Promise<void> {
      await collection.deleteMany(filter);
   };

   /**
    * Prepara un nuovo documento inizializzando alcune proprietà. Se è già presente un documento
    * valorizzato, questo sarà perso.
    * @param type
    */
   public new(type: string): void {
      this._document = {};
      this._document["type"] = type;
   };

   /**
    * Legge il documento con la chiave _id specificata nel campo key. La chiave di partenza deve essere
    * già un oggetto ObjectId. Nel caso in cui non venga trovato nulla, viene alzata un'eccezione.
    * @param _id
    */
   public async load(_id: mongoDB.ObjectId): Promise<void> {
      let result: object[];

      result = await this._select(this._collection, {"_id": _id});
      if(result.length === 0)
         throw new Error("not found");
      else
         this._document = result[0];
   };

   /**
    * Effettua il controllo sulla presenza di valori validi nelle proprietà obbligatorie.
    */
   public check(): void {
      if(this._document["type"] === undefined)
         throw new Error("mandatory fields missing");
   };

   /**
    * Permette di registrare le modifiche apportate a un documento.
    */
   public async save(): Promise<void> {
      // Se non presente aggiunge la proprietà locked:
      if(this._document["locked"] === undefined)
         this._document["locked"] = false;

      // Inserisce la data di creazione oppure aggiorna quella di modifica:
      if(this._document["created_at"] === undefined)
         this._document["created_at"] = new Date();
      else
         this._document["changed_at"] = new Date();

      // Inserisce o modifica documento con la chiave indicata:
      if(this._document["_id"] === undefined)
         await this._collection.insertOne(this._document);
      else
         await this._collection.replaceOne({"_id": this._document["_id"]}, this._document);
   };
}