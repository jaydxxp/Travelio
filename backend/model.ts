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
export interface IActivity {
  icon: string;
  title: string;
  description: string;
}

export interface IPlaceToVisit {
  name: string;
  time: string;
  image: string;
  description: string;
}

export interface IAccommodation {
  budget: string;
  mid: string;
  luxury: string;
}

export interface IBestTime {
  months: string;
  weather: string;
  tip: string;
}

export interface ISuggestedTrip extends Document {
  destination: string;
  country: string;
  image: string;
  description: string;
  bestTime: IBestTime;
  duration: string;
  highlights: string[];
  activities: IActivity[];
  placesToVisit: IPlaceToVisit[];
  travelTips: string[];
  accommodation: IAccommodation;
  createdAt: Date;
}



const ActivitySchema = new Schema<IActivity>({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const PlaceToVisitSchema = new Schema<IPlaceToVisit>({
  name: { type: String, required: true },
  time: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

const BestTimeSchema = new Schema<IBestTime>({
  months: { type: String, required: true },
  weather: { type: String, required: true },
  tip: { type: String, required: true },
});

const AccommodationSchema = new Schema<IAccommodation>({
  budget: { type: String, required: true },
  mid: { type: String, required: true },
  luxury: { type: String, required: true },
});

const SuggestedTripSchema = new Schema<ISuggestedTrip>({
  destination: { type: String, required: true },
  country: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  bestTime: { type: BestTimeSchema, required: true },
  duration: { type: String, required: true },
  highlights: { type: [String], default: [] },
  activities: { type: [ActivitySchema], default: [] },
  placesToVisit: { type: [PlaceToVisitSchema], default: [] },
  travelTips: { type: [String], default: [] },
  accommodation: { type: AccommodationSchema, required: true },
  createdAt: { type: Date, default: Date.now },
});
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



export const Itinerary: Model<IItinerary> = mongoose.model<IItinerary>('Itinerary', ItinerarySchema);
export const SuggestedTrip: Model<ISuggestedTrip> = mongoose.model<ISuggestedTrip>('SuggestedTrip', SuggestedTripSchema);
