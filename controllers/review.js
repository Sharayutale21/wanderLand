const Listing = require("../models/listing")
const Review = require("../models/review")

module.exports.createReview = async(req,res)=>{
	console.log(req.params.id)
	let listing = await Listing.findById(req.params.id);
	let newReview = new Review(req.body.review);
	newReview.author = req.user._id;
	console.log(newReview)
	listing.reviews.push(newReview);

	await newReview.save();
	await listing.save();

	req.flash("success","New review created!")
	res.redirect(`/listings/${listing._id}`)
}
module.exports.getReviews = async (req, res) => {
	const { id } = req.params; // Listing ID
	const listing = await Listing.findById(id).populate('reviews'); // Fetch reviews and populate them
	res.redirect(`/listings/${id}`); // Return reviews in JSON format (or render a page as needed)
  };

module.exports.destroyReview= async (req,res)=>{
	let {id , reviewId} = req.params;
	await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}});
	let deletedReview =  await Review.findByIdAndDelete(reviewId);

	console.log(deletedReview)
	
	res.redirect(`/listings/${id}`);

}