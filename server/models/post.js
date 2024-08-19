const { ObjectId } = require("mongodb");
const { db } = require("../config/mongodb");
class Post {
    static col(){
        return db.collection("Posts")
    }

    static async findAll(){
        const result = await this.col().find().toArray()
        return result
    }

    static async findByPk(id){
        const result = await this.col().findOne({_id: new ObjectId(id)})
        return result
    }

    static async create(newPost){
        const result = await this.col().insertOne(newPost)

        return {
            ...newPost,
            _id: result.insertedId
        }
    }

    static async update(id, updatePost){
        const result = await this.col().updateOne({_id: new ObjectId(id)},{
            $set:{
                ...updatePost
            }
        })
        return {
            ...updatePost,
            _id: id
        }
    }

    static async deleteById(id){
        await this.col().deleteOne({
            _id: new ObjectId(id)
        })
    }
}

module.exports = Post