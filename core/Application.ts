/**
 * Librerie
 */
import {Base} from "./Base";

/**
 * Classe di gestione delle applicazioni presenti nel Portale.
 */
export class Application extends Base {

   /**
    * Getter
    */
   get name(): string {
      return this._document["name"];
   };
   get description(): string {
      return this._document["description"];
   };
   get position(): number {
      return parseInt(this._document["position"]);
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
   set position(value: number) {
      this._document["position"] = value;
   };

   /**
    * Restituisce tutte le applicazioni che rispondono alla condizione di filtro.
    * @param filter
    */
   public static async getApplications(filter: object = {}): Promise<object[]> {
      let b = new Base();

      // Aggiunge al filtro la tipologia di documento da cercare:
      filter["type"] = "application";

      // Effettua la ricerca:
      let result: object[] = await b.select("admin", filter);

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
    * Inizializza il documento per una nuova applicazione.
    */
   public new(): void {
      super.new("application");
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
    * Permette di accedere a un'applicazione tramite il suo nome.
    * @param name
    */
   public async loadByName(name: string): Promise<void> {
      let result: object[] = await this._select(this._collection, {"name": name});
      this._document = result[0];
   };

   /**
    * Personalizza il salvataggio dell'applicazione in mod da impostare la proprietà
    * position a zero se non diversamente specificato.
    */
   public async save():Promise<void> {
      if(this._document["position"] === undefined)
         this._document["position"] = 0;
      await super.save();
   };

   /**
    * Verifica se l'applicazione è usata in un profilo. Utile per gestire la
    * cancellazione fisica senza creare incoerenze nella base dati.
    */
   public async isUsed(): Promise<number> {
      return await this.count({"type": "application", "_id": this._id});
   };
 }