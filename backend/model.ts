import mongoose, { Document, Schema, Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

mongoose
  .connect(process.env.Mongoose!)
  .then(() => console.log('Database Connected'))
  .catch((e) => console.log(e));

export interface IWeather {
  date: string;
  temp: number;
  description: string;
  icon: string;
}

export interface IActivityPlan {
  time: string;
  activity: string;
  location: string;
  lat?: number;
  lng?: number;
  imageUrl?: string;
  weather?: IWeather;
}

export interface IDayActivity {
  day: number;
  plans: IActivityPlan[];
}

export interface IItinerary extends Document {
  destination: string;
  travelDates: { start: Date; end: Date };
  interests: string[];
  activities: IDayActivity[];
  shareableId: string;
  createdAt: Date;
}

export interface ISuggestedTrip extends Document {
  title: string;
  destination: string;
  highlights: string[];
  bestTimeToVisit: string;
  imageUrl?: string;
  createdAt: Date;
}

const ActivityPlanSchema: Schema<IActivityPlan> = new Schema({
  time: { type: String, required: true },
  activity: { type: String, required: true },
  location: { type: String, required: true },
  lat: Number,
  lng: Number,
  imageUrl: String,
  weather: {
    date: String,
    temp: Number,
    description: String,
    icon: String,
  },
});

const DayActivitySchema: Schema<IDayActivity> = new Schema({
  day: { type: Number, required: true },
  plans: { type: [ActivityPlanSchema], default: [] },
});

const ItinerarySchema: Schema<IItinerary> = new Schema({
  destination: { type: String, required: true },
  travelDates: {
    start: { type: Date, required: true },
    end: { type: Date, required: true },
  },
  interests: { type: [String], default: [] },
  activities: { type: [DayActivitySchema], default: [] },
  shareableId: { type: String, default: () => uuidv4() },
  createdAt: { type: Date, default: Date.now },
});

const SuggestedTripSchema: Schema<ISuggestedTrip> = new Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  highlights: { type: [String], default: [] },
  bestTimeToVisit: { type: String },
  imageUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Itinerary: Model<IItinerary> = mongoose.model<IItinerary>('Itinerary', ItinerarySchema);
export const SuggestedTrip: Model<ISuggestedTrip> = mongoose.model<ISuggestedTrip>('SuggestedTrip', SuggestedTripSchema);
