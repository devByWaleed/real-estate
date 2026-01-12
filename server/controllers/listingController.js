import Listing from "../models/ListingModel.js"

export const createListing = async (req, res, next) => {
    try {
        // const listing = await Listing.create(req.body);
        const listing = await Listing.create({
            ...req.body,
            userRef: req.user.id, // 
        });
        return res.status(201).json(listing)

    } catch (error) {
        next(error)
    }
}