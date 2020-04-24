export interface UserProfile {
  uid?: string;
  name?: string;
  email: string; 
  city?: string;
  gender?: string;
  career?: string;
  favoriteFoods?: Array<string>;
  interests?: Array<string>;
  }