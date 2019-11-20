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

CREATE PROCEDURE insertEvals 
    @firstName VARCHAR(100),
    @lastName VARCHAR(100),
    @quarter VARCHAR(5),
    @academicYear VARCHAR(5),
    @numSurveyed VARCHAR(5),
    @numEnrolled VARCHAR(5),
    @courseAsWholeScore VARCHAR(5),
    @courseContentScore VARCHAR(5),
    @proContributionScore VARCHAR(5),
    @proEffectivenessScore VARCHAR(5) 
AS DECLARE @G_ID INT

IF
    @firstName IS NULL OR @lastName IS NULL OR @quarter IS NULL OR @academicYear IS NULL OR
    @numSurveyed IS NULL OR @numEnrolled IS NULL OR @courseAsWholeScore IS NULL OR 
    @courseContentScore IS NULL OR @proContributionScore IS NULL OR @proEffectivenessScore IS NULL
BEGIN
PRINT 'Parameters must have a value'
RAISERROR('Parameters cannot be NULL', 11, 1)
RETURN 
END

SET @G_ID = (SELECT SCOPE_IDENTITY())

BEGIN TRAN G1
INSERT INTO evaluations(firstName, lastName, quarter, academicYear, numSurveyed, numEnrolled, courseAsWholeScore,
                        courseContentScore, proContributionScore, proEffectivenessScore)
VALUES (@firstName, @lastName, @quarter, @academicYear, @numSurveyed, @numEnrolled, @courseAsWholeScore, 
        @courseContentScore, @proContributionScore, @proEffectivenessScore)

IF @@ERROR <> 0
	ROLLBACK TRAN G1
ELSE 
	COMMIT TRAN G1
GO

SELECT * FROM evaluations