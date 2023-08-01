import { RatingModel } from "./rating.model";

export interface ProductModel {
  id: number;
  title: string;
  price: string;
  category: string;
  description: string;
  image: string;
  rating: RatingModel
}
