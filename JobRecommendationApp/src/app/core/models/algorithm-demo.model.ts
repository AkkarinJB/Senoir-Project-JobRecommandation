export interface JaccardDemoRequest {
  jobSkills: string;
  candidateSkills: string;
}

// ต้องตรงกับ JaccardDemoResultDto.cs ฝั่ง backend เป๊ะ ใช้แสดงผลทีละขั้นตอนในหน้าสาธิตอัลกอริทึม
export interface JaccardDemoResult {
  setA: string[];
  setB: string[];
  intersection: string[];
  union: string[];
  intersectionCount: number;
  unionCount: number;
  matchPercentage: number;
}
