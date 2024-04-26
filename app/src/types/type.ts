export interface Organization {
  id: number;
  username: string;
  email: string;
  name: string;
  location: string;
  website?: string;
  overview: string;
  foundedAt: number;
  profilePic: string;
}

export interface JobSeeker {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  description: string;
  yearsOfExperience: number;
  phoneNumber: number;
  skills: string[];
  profilePic: string;
  resume: string | null;
  jobApplications: Application[];
}

export interface JobProfile {
  id: number;
  role: string;
  requiredExperience: number;
  employeeType: string;
  salary: number;
  location: string;
  jobDescription: string;
  skillsRequired: string[];
  createdAt: Date;
  updatedAt: Date;
  organizationId: number;
  applications?: Application[];
  organization: {
    username: string;
    email: string;
    name: string;
    location: string;
    website?: string;
    overview: string;
    foundedAt: number;
    profilePic: string;
  };
}

export interface ZodErrorResponse {
  error: {
    issues: {
      code: string;
      expected: string;
      received: string;
      path: string[];
      message: string;
    }[];
    name: string;
  };
}

export enum Status {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

// Define the Application model type
export interface Application {
  id: number;
  jobProfile: JobProfile;
  jobProfileId: number;
  jobSeeker: JobSeeker;
  jobSeekerId: number;
  status: Status;
  applicationDate: Date;
  updatedAt: Date;
}

export enum ConnectionStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  FOLLOW = "FOLLOW",
}

export interface Connection {
  id: number;
  followedBy: JobSeeker; // Assuming JobSeeker type is defined elsewhere
  followedById: number;
  following: JobSeeker; // Assuming JobSeeker type is defined elsewhere
  followingId: number;
  status: ConnectionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id?: number; // The ID is optional as it might not be available during creation
  role: string;
  company: string;
  techStack: string[];
  startMonth: string;
  startYear: number;
  endMonth?: string | null; // End month is nullable as it might not be provided
  endYear?: number | null; // End year is nullable as it might not be provided
  jobSeeker: JobSeeker; // Assuming JobSeeker is another interface representing the JobSeeker model
  jobSeekerId: number;
}

export interface Project {
  id: number;
  name: string;
  image?: string | null;
  description: string;
  deployedLink?: string | null;
  repoLink?: string | null;
  techStack: string[];
  createdAt: Date;
  updatedAt: Date;
  jobSeekerId: number;
}
