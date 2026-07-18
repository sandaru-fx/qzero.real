export type ReviewView = {
  id: string;
  clientName: string;
  vehicleName: string;
  reviewText: string;
  rating: number;
  imageUrl: string;
  isFeatured: boolean;
  createdAt: string;
};

export type ReviewFormInput = {
  clientName: string;
  vehicleName: string;
  reviewText: string;
  rating: number;
  imageUrl: string;
  isFeatured: boolean;
};
