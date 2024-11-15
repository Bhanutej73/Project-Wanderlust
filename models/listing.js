const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Review=require("./review.js");
const ListingSchema= new Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image:{
        filename: {
            type: String,
            default: "default-image-filename.jpg" // Set a default filename if needed
        },
        url:{
        type:String,
        default:"https://www.shutterstock.com/image-vector/abstract-white-gray-background-smooth-blurred-2499544217",
        set:(v)=>v===""?"https://www.shutterstock.com/image-vector/abstract-white-gray-background-smooth-blurred-2499544217":v,
        }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
});

ListingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listing.reviews}});
    }    
}); // This is a mongoose middleware that runs after a listing is deleted. We can use this to delete all reviews associated with the listing.

const listing=mongoose.model("listing",ListingSchema);
module.exports=listing;