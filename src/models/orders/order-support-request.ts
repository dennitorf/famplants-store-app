export enum OrderSupportRequestStatus {
  Submitted = 1,
  UnderReview = 2,
  Resolved = 3,
  Closed = 4,
}

export enum OrderSupportIssueType {
  DamagedPlant = 1,
  WrongItemReceived = 2,
  MissingItem = 3,
  Other = 4,
}

export enum PreferredSupportResolution {
  Replacement = 1,
  Refund = 2,
}

export interface OrderSupportRequestImage {
  id: string;
  displayOrder: number;
  originalFileName: string;
  contentType: string;
  sizeInBytes: number;
  width: number;
  height: number;
  url: string;
}

export interface OrderSupportRequest {
  id: string;
  orderId: string;
  supportRequestStatus: OrderSupportRequestStatus;
  issueType: OrderSupportIssueType;
  description: string;
  preferredResolution: PreferredSupportResolution;
  createdDate: string;
  images: OrderSupportRequestImage[];
}
