import mongoose from "mongoose";

const specialOfferSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: false },
    imageUrl: { type: String, default: "" },
    alt: { type: String, default: "Special Offer", trim: true },
    badgeText: { type: String, default: "🎉 Special Offer", trim: true },
    tabLabel: { type: String, default: "🎉 Offer", trim: true },
    tagline: {
      type: String,
      default: "Limited time deal — don't miss it!",
      trim: true,
    },
    ctaText: { type: String, default: "Explore Now", trim: true },
    ctaLink: { type: String, default: "/services", trim: true },
    delay: { type: Number, default: 1200, min: 0 },
  },
  { timestamps: true }
);

const SpecialOffer =
  mongoose.models.SpecialOffer ||
  mongoose.model("SpecialOffer", specialOfferSchema);

export default SpecialOffer;
