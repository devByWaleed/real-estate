import Listing from "../models/ListingModel.js"
import { errorHandler } from "../utils/error.js";

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



export const getUserListing = async (req, res, next) => {
    if (req.user.id === req.params.id) {
        try {
            const listing = await Listing.find(({ userRef: req.params.id }))
            res.status(200).json(listing)

        } catch (error) {
            next(error)
        }
    }

    else {
        return next(errorHandler(401, "You can only view your own listings!"))
    }
}



export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
        return next(errorHandler(404, "Listings not found!"))
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only update your own listings!"))
    }


    try {
        const updatedListing = await Listing.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        res.status(200).json(updatedListing)
    } catch (error) {
        next(error)
    }
}



export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
        return next(errorHandler(404, "Listings not found!"))
    }

    if (req.user.id !== listing.userRef) {
        return next(errorHandler(401, "You can only delete your own listings!"))
    }


    try {
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json("Listing has been deleted!")
    } catch (error) {
        next(error)
    }
}