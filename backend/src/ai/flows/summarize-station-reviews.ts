'use server';

/**
 * @fileOverview Summarizes user reviews for a given station.
 *
 * - summarizeStationReviews - A function that takes station ID and review text as input and returns a summary of the reviews.
 * - SummarizeStationReviewsInput - The input type for the summarizeStationReviews function.
 * - SummarizeStationReviewsOutput - The return type for the summarizeStationReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeStationReviewsInputSchema = z.object({
  stationId: z.string().describe('The ID of the station to summarize reviews for.'),
  reviews: z.string().describe('The text of the reviews for the station.'),
});
export type SummarizeStationReviewsInput = z.infer<
  typeof SummarizeStationReviewsInputSchema
>;

const SummarizeStationReviewsOutputSchema = z.object({
  summary: z
    .string()
    .describe('A summary of the user reviews for the station.'),
});
export type SummarizeStationReviewsOutput = z.infer<
  typeof SummarizeStationReviewsOutputSchema
>;

export async function summarizeStationReviews(
  input: SummarizeStationReviewsInput
): Promise<SummarizeStationReviewsOutput> {
  return summarizeStationReviewsFlow(input);
}

const summarizeStationReviewsPrompt = ai.definePrompt({
  name: 'summarizeStationReviewsPrompt',
  input: {schema: SummarizeStationReviewsInputSchema},
  output: {schema: SummarizeStationReviewsOutputSchema},
  prompt: `You are an expert summarizer of user reviews for bike stations.

  Given the following reviews for station with ID {{{stationId}}}, create a concise summary of the reviews, highlighting common themes and sentiments.

  Reviews: {{{reviews}}}`,
});

const summarizeStationReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeStationReviewsFlow',
    inputSchema: SummarizeStationReviewsInputSchema,
    outputSchema: SummarizeStationReviewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeStationReviewsPrompt(input);
    return output!;
  }
);
