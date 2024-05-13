import { z } from 'zod';

export const BountySchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    twitterProfile: z.string().url({ message: "Invalid Twitter profile URL" }).refine(value => value.includes('twitter.com'), { message: "Not a Twitter profile URL" }),
    linkedInProfile: z.string().url({ message: "Invalid LinkedIn profile URL" }).refine(value => value.includes('linkedin.com'), { message: "Not a LinkedIn profile URL" }),
    submissionLink: z.string().url({ message: "Invalid submission link URL" }),
    notes: z.string().optional(),
    upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, { message: "Invalid UPI ID format" }).optional(),
    addToTalentPool: z.boolean().optional(),
});
