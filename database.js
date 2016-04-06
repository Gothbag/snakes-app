var mongo = require('mongodb'),
    client = mongo.MongoClient,
    ObjectId = mongo.ObjectId,
        mongodb;
 
module.exports =  {
    connect: function(dburl, callback) {
        client.connect(dburl,
            function(err, db){
                mongodb = db;
                if(callback) { callback(); }
            });
    },
    db: function() {
        return mongodb;
    },
    close: function() {
        mongodb.close();
    },
    ObjectId: ObjectId
};