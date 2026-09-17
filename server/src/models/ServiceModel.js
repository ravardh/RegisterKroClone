import mongoose from "mongoose";
import { createUniqueSlug } from "../utils/slug.js";

const whyChooseUsCardSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false },
);

const serviceSchema = new mongoose.Schema(
  {
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    OneLinner: {
      type: String,
      required: true,
    },
    priceTag: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    sequence: {
      type: Number,
      required: false,
    },
    topPointers: [
      {
        type: String,
      },
    ],
    description: [
      {
        tabs: { type: String },
        content: { type: String },
      },
    ],
    faqs: [
      {
        question: {
          type: String,
          required: true,
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    Featured: {
      isFeatured: {
        type: Boolean,
        default: false,
      },
      featureOrder: {
        type: String,
        default: null,
      },
    },
    packages: [
      {
        name: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: false,
        },
        includedFeatures: [
          {
            type: String,
          },
        ],
        isMostPopular: {
          type: Boolean,
          default: false,
        },
      },
    ],
    offer: {
      type: String,
      default: null,
    },
    lastEditedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    documents: [
      {
        displayName: {
          type: String,
          required: true,
        },
        filename: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],
    relatedServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    whyChooseus: {
      type: [whyChooseUsCardSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

serviceSchema.pre("save", async function () {
  if (this.serviceName && (this.isNew || this.isModified("serviceName") || !this.slug)) {
    this.slug = await createUniqueSlug({
      model: this.constructor,
      source: this.serviceName,
      excludeId: this._id,
      fallback: "service",
    });
  }
});

const Service = mongoose.model("Service", serviceSchema);
export default Service;
