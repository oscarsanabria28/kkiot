const mongo = require("mongodb");


var url = 'mongodb://localhost:27017/Login';


class DatabaseConnector{
    
    
    constructor(dbUrl){
        
        this.mongoClient = mongo.MongoClient;
        this.db = null;
    }
    
    static getDatabaseConnection(){
        
        if( DatabaseConnector.databaseInstance == null){
            
            DatabaseConnector.databaseInstance = new DatabaseConnector(url);
        
        }
        
        return DatabaseConnector.databaseInstance;
        
        
    }
    
    
    
    insertDocument(collection, data,  cb){
    
        
        if( this.db != null){
            
            this.db.collection(collection).insertOne( data  , function(err,r){
                console.log("Error inserting " + err + " OR RESULT " + r);
                cb(err , r);
            } );
        
            
        }else{
        
            this.mongoClient.connect( url, (err,db)=>{

                this.db = db;
        
                this.db.collection(collection).insertOne( data  , function(err,r){
                    console.log("Error inserting " + err + " OR RESULT " + r);
                    cb(err , r);
                } );
    
      
        });
        
        }
         
    }
	
	///////Experimental Borrar si la cago////////////////////
    updateCollection(collection, qFind,  uptData){
		
        if( this.db != null){
            
            this.db.collection(collection).update( qFind  , uptData);
            
        }else{
        
            this.mongoClient.connect( url, (err,db)=>{

                this.db = db;
        
                this.db.collection(collection).update( qFind  , uptData);
    
      
        });
        
       }
         
    }
	
	insertLog(collection, data){
		
        if( this.db != null){
            
            this.db.collection(collection).insertOne(data);
        
            
        }else{
        
            this.mongoClient.connect( url, (err,db)=>{

                this.db = db;
        
                this.db.collection(collection).insertOne(data);
    
      
        });
        
        }
         
    }
	////////////////////////////////////////////Insertar Usuario /////////////////////////////////////////////////////////////////	
	insertUsuario(collection, data){
		
        if( this.db != null){
            
            this.db.collection(collection).insertOne(data);
        
            
        }else{
        
            this.mongoClient.connect( url, (err,db)=>{

                this.db = db;
        
                this.db.collection(collection).insertOne(data);
    
        });
        
        }
         
    }
	
	//////////////////////////////////////////////////////////////////////////////////////////////7777
    /*
    * After done, a connection has been made and stays connected subsequent calls will not make secoondary connections
    */
    findInCollection(collection, findRestrictions,  cb ){
        this.db=null;
        
        if( this.db != null){
            
            var cursor = db.collection(collection).find(findRestrictions);
            
           
            
            if( err != null){
                cb(null);
                
            }else{
                cb(cursor);
            }
            
        }else{
        
            this.mongoClient.connect( url, (err,db)=>{

                this.db = db;
        
                var cursor = this.db.collection(collection).find(findRestrictions);
                
                
                // cursor should also be closed!!!
                
                if( err != null ){
                    cb(null);

                }else{

                    cb(cursor);


                }    
      
        });
        
        }
    }
    
    close(){
        
        if( this.db != null)
            this.db.close();
        this.db = null;
    }
    
}


DatabaseConnector.databaseInstance = null;

module.exports = DatabaseConnector;