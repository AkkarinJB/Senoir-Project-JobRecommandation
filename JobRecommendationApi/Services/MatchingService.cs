using System;
using System.Collections.Generic;
using System.Linq;
using JobRecommendationApi.DTOs;

namespace JobRecommendationApi.Services
{
    public class MatchingService : IMatchingService
    {
        public double CalculateJaccardSimilarity(string jobSkills, string candidateSkills)
        {
            if (string.IsNullOrWhiteSpace(jobSkills) || string.IsNullOrWhiteSpace(candidateSkills))
            {
                return 0.0;
            }

            return GetJaccardBreakdown(jobSkills, candidateSkills).MatchPercentage;
        }

        public JaccardDemoResultDto GetJaccardBreakdown(string jobSkills, string candidateSkills)
        {
            char[] delimiters = { ',', ' ' };

            var setA = new HashSet<string>(
                (jobSkills ?? string.Empty).Split(delimiters, StringSplitOptions.RemoveEmptyEntries)
                .Select(word => word.ToLowerInvariant().Trim())
            );

            var setB = new HashSet<string>(
                (candidateSkills ?? string.Empty).Split(delimiters, StringSplitOptions.RemoveEmptyEntries)
                .Select(word => word.ToLowerInvariant().Trim())
            );

            var intersection = setA.Intersect(setB).ToList();
            var union = setA.Union(setB).ToList();

            double matchPercentage = 0.0;
            if (union.Count > 0)
            {
                double jaccardIndex = (double)intersection.Count / union.Count;
                matchPercentage = Math.Round(jaccardIndex * 100, 2);
            }

            return new JaccardDemoResultDto
            {
                SetA = setA.ToList(),
                SetB = setB.ToList(),
                Intersection = intersection,
                Union = union,
                IntersectionCount = intersection.Count,
                UnionCount = union.Count,
                MatchPercentage = matchPercentage
            };
        }
    }
}