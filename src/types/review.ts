export type ReviewView = {
  id: string;
  clientName: string;
  vehicleName: string;
  reviewText: string;
  rating: number;
  imageUrl: string;
  isFeatured: boolean;
  isApproved: boolean;
  createdAt: string;
};

export type ReviewFormInput = {
  clientName: string;
  vehicleName: string;
  reviewText: string;
  rating: number;
  imageUrl: string;
  isFeatured: boolean;
  isApproved?: boolean;
};

export type ClientReviewInput = {
  clientName: string;
  vehicleName: string;
  reviewText: string;
  rating: number;
};
