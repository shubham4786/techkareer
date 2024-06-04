import { StringFormat } from "firebase/storage";

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
  export interface User {
    id: number;
    name?: string;
    email:string;
    password?: string;
    onboarded: boolean;
    description?:string;
    profilePic: string;
    provider: string;
    type: number;
  }
  
  export interface Candidate {
     
    id: number;
    name: string;
    email: string;
    github?: string;
    resume?: string;
    linkedin?: string;
    roles: string[];
    commitment: string[];
    opportunity?: string;
profilePic: string;
    introduction?: string;
    twitter?: string;
    minIncome?: number;
    referralID?: string;
    createdAt: Date;

  }
  export interface Opportunity {
    id: number;
    title: string;
    companyName: string;
    companyTagline: string;
    companyDesc: string;
    companyLogo?: string;
    role: string;
    roleApplyingFor: string;
    payRange: string;
    quantity?: number;
    minAnnualPay?: number;
    maxAnnualPay?: number;
    currency?: string;
    minMonthlyPay: number;
    maxMonthlyPay: number;
    equity?: number;
    vestingProcedure?: string;
    potentialRevenueCompany?: number;
    potentialRevenueCandidate?: number;
    waiveFeesCompany?: boolean;
    waiveFeesCandidate?: boolean;
    totalPotentialRevenue?: number;
    jobID?: string;
    commitment: string;
    location: string;
    yearsExp?: string;
    deadline?: Date;
    isActive?: boolean;
    cutsomJobPortalLink?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  export interface Bounty {
    id: number;
    title: string;
    desc: string;
    amount: number;
    twitterLink: string;
    gigType: string;
    role: string[];
    deadline: Date;
    winner?: string | null;
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