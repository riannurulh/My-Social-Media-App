const { ObjectId } = require("mongodb");
const { db } = require("../config/mongodb");
class User {
    static col(){
        return db.collection("User")
    }

    static async findAll(){
        const result = await this.col().find().toArray()
        return result
    }

    static async findByPk(id){
        const result = await this.col().findOne({_id: new ObjectId(id)})
        return result
    }

    static async findOne(value){
        const result = await this.col().findOne({value})
        return result
    }

    static async create(newUser){
        const result = await this.col().insertOne(newUser)

        return {
            ...newUser,
            _id: result.insertedId
        }
    }

    // static async findByPk(){}

    // static async findByPk(){}
}

module.exports = User