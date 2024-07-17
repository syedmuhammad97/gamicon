export type IContextType = {
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
}

export type INavLink = {
    imgURL: string;
    route: string;
    label: string;
  };
  
  export type IUpdateUser = {
    userId: string;
    name: string;
    username: string;
    email: string;
    bio: string;
    imageId: string;
    imageURL: URL | string;
    file: File[];
    roleType: string;
  };
  
  export type INewPost = {
    userId: string;
    content: string;
    file: File[];
    location?: string;
    tags?: string;
  };
  
  export type IUpdatePost = {
    postId: string;
    content: string;
    imageId: string;
    imageURL: URL;
    file: File[];
    location?: string;
    tags?: string;
  };

  export type INewBooking = {
    userId: string;
    dateAndTime: Date;
    userLimit: number;
    attendees: string[];
  };

  export type IUpdateBooking = {
    bookingId: string;
    dateAndTime: Date;
    userLimit: number;
    attendees: string[];
  };
  
  export type IUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    imageURL: string;
    bio: string;
    points: number;
    stars: number;
    roleType: string;
  };
  
  export type INewUser = {
    name: string;
    email: string;
    username: string;
    password: string;
  };