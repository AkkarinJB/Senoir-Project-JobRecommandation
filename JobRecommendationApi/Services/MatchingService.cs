using System;
using System.Collections.Generic;
using System.Linq;

namespace JobRecommendationApi.Services
{
    public class MatchingService : IMatchingService
    {
        public double CalculateCosineSimilarity(string jobSkills, string candidateSkills)
        {
            if (string.IsNullOrWhiteSpace(jobSkills) || string.IsNullOrWhiteSpace(candidateSkills))
            {
                return 0.0;
            }

            char[] delimiters = { ',', ' ' };
            var listA = jobSkills.Split(delimiters, StringSplitOptions.RemoveEmptyEntries)
                                 .Select(s => s.ToLowerInvariant().Trim()).ToList();
            
            var listB = candidateSkills.Split(delimiters, StringSplitOptions.RemoveEmptyEntries)
                                       .Select(s => s.ToLowerInvariant().Trim()).ToList();

            var allUniqueSkills = listA.Union(listB).Distinct().ToList();

            var vectorA = allUniqueSkills.Select(skill => listA.Contains(skill) ? 1.0 : 0.0).ToList();
            var vectorB = allUniqueSkills.Select(skill => listB.Contains(skill) ? 1.0 : 0.0).ToList();

            double dotProduct = 0.0;
            for (int i = 0; i < allUniqueSkills.Count; i++)
            {
                dotProduct += vectorA[i] * vectorB[i];
            }

            double magnitudeA = Math.Sqrt(vectorA.Sum(x => x * x));
            double magnitudeB = Math.Sqrt(vectorB.Sum(x => x * x));

            if (magnitudeA == 0 || magnitudeB == 0)
            {
                return 0.0;
            }

            double similarity = dotProduct / (magnitudeA * magnitudeB);
            return Math.Round(similarity * 100, 2);
        }

        public double CalculateLocationScore(string? candidateLocation, string? jobLocation)
        {
            if (string.IsNullOrWhiteSpace(candidateLocation))
            {
                return 50.0;
            }

            if (string.IsNullOrWhiteSpace(jobLocation))
            {
                return 0.0;
            }

            var candidate = candidateLocation.Trim().ToLowerInvariant();
            var job = jobLocation.Trim().ToLowerInvariant();

            if (candidate == job) return 100.0;

            // ตรงกันบางส่วน เช่น ผู้สมัครระบุ "อุดรธานี" ตรงกับประกาศ "อ.เมือง อุดรธานี"
            if (job.Contains(candidate) || candidate.Contains(job)) return 70.0;

            return 0.0;
        }
    }
}