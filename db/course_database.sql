USE Group2_Final

CREATE TABLE evaluations (
    evalID INT IDENTITY(1,1) PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100),
    quarter VARCHAR(5),
    academicYear VARCHAR(5),
    numSurveyed VARCHAR(5),
    numEnrolled VARCHAR(5),
    courseAsWholeScore VARCHAR(5),
    courseContentScore VARCHAR(5),
    proContributionScore VARCHAR(5),
    proEffectivenessScore VARCHAR(5)
)
GO