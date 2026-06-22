import fs from "fs";
import path from "path";
import SpecialOffer from "../models/SpecialOffer.js";

const parseBool = (value) =>
  value === true || value === "true" || value === "1" || value === 1;

const DEFAULTS = {
  isActive: false,
  imageUrl: "",
  alt: "Special Offer",
  badgeText: "🎉 Special Offer",
  tabLabel: "🎉 Offer",
  tagline: "Limited time deal — don't miss it!",
  ctaText: "Explore Now",
  ctaLink: "/services",
  delay: 1200,
};

const getOrCreateOffer = async () => {
  let offer = await SpecialOffer.findOne();
  if (!offer) {
    offer = await SpecialOffer.create(DEFAULTS);
  }
  return offer;
};

const unlinkIfOfferImage = (imagePath) => {
  if (!imagePath?.startsWith("/uploads/offer-images/")) return;
  const abs = path.join(process.cwd(), imagePath.replace(/^\//, ""));
  fs.unlink(abs, () => {});
};

export const getAdminSpecialOffer = async (req, res, next) => {
  try {
    const offer = await getOrCreateOffer();
    res.status(200).json({
      message: "Special offer settings fetched successfully",
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSpecialOffer = async (req, res, next) => {
  try {
    const offer = await getOrCreateOffer();
    const {
      isActive,
      alt,
      badgeText,
      tabLabel,
      tagline,
      ctaText,
      ctaLink,
      delay,
      removeImage,
    } = req.body;

    if (isActive !== undefined) offer.isActive = parseBool(isActive);

    if (alt !== undefined) offer.alt = String(alt).trim() || DEFAULTS.alt;
    if (badgeText !== undefined) {
      offer.badgeText = String(badgeText).trim() || DEFAULTS.badgeText;
    }
    if (tabLabel !== undefined) {
      offer.tabLabel = String(tabLabel).trim() || DEFAULTS.tabLabel;
    }
    if (tagline !== undefined) {
      offer.tagline = String(tagline).trim() || DEFAULTS.tagline;
    }
    if (ctaText !== undefined) {
      offer.ctaText = String(ctaText).trim() || DEFAULTS.ctaText;
    }
    if (ctaLink !== undefined) {
      offer.ctaLink = String(ctaLink).trim() || DEFAULTS.ctaLink;
    }
    if (delay !== undefined && delay !== "") {
      const delayNum = Number(delay);
      if (Number.isFinite(delayNum) && delayNum >= 0) {
        offer.delay = delayNum;
      }
    }

    if (parseBool(removeImage) && offer.imageUrl) {
      unlinkIfOfferImage(offer.imageUrl);
      offer.imageUrl = "";
    }

    if (req.file) {
      if (offer.imageUrl) unlinkIfOfferImage(offer.imageUrl);
      offer.imageUrl = `/uploads/offer-images/${req.file.filename}`;
    }

    if (offer.isActive && !offer.imageUrl) {
      const error = new Error("An offer image is required when the offer is active");
      error.statusCode = 400;
      return next(error);
    }

    await offer.save();

    res.status(200).json({
      message: "Special offer settings updated successfully",
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicSpecialOffer = async (req, res, next) => {
  try {
    const offer = await SpecialOffer.findOne().lean();
    if (!offer?.isActive || !offer?.imageUrl) {
      return res.status(200).json({ data: null });
    }

    res.status(200).json({
      data: {
        imageUrl: offer.imageUrl,
        alt: offer.alt,
        badgeText: offer.badgeText,
        tabLabel: offer.tabLabel,
        tagline: offer.tagline,
        ctaText: offer.ctaText,
        ctaLink: offer.ctaLink,
        delay: offer.delay,
      },
    });
  } catch (error) {
    next(error);
  }
};
