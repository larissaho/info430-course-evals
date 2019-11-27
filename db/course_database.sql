USE Group2_Final

-- evaluations table: 
CREATE TABLE evaluations (
    evalID INT IDENTITY(1,1) PRIMARY KEY,
    courseID INT,
    profID INT, 
    quarter VARCHAR(5),
    year INT,
    numSurveyed INT,
    numEnrolled INT,
    courseAsWholeScore FLOAT,
    courseContentScore FLOAT,
    proContributionScore FLOAT,
    proEffectivenessScore FLOAT
)
GO 

CREATE PROCEDURE insertEvals 
    @courseNumber INT,
    @firstName VARCHAR(100),
    @lastName VARCHAR(100),
    @quarter VARCHAR(5),
    @year INT,
    @numSurveyed INT,
    @numEnrolled INT,
    @courseAsWholeScore FLOAT,
    @courseContentScore FLOAT,
    @proContributionScore FLOAT,
    @proEffectivenessScore FLOAT
AS 

BEGIN

SET NOCOUNT ON 

DECLARE @C_ID INT
    EXEC find_course @courseNumber, @courseID = @C_ID out

IF @C_ID IS NULL
    BEGIN
    INSERT INTO courses(courseNumber)
    VALUES (@courseNumber) 
    SELECT @C_ID = SCOPE_IDENTITY()
    END

DECLARE @P_ID INT
    EXEC find_professor @firstName, @lastName, @profID = @P_ID out

IF @P_ID IS NULL
    BEGIN
    INSERT INTO professors(firstName, lastName)
    VALUES (@firstName, @lastName)
    SELECT @P_ID = SCOPE_IDENTITY()
    END

BEGIN TRAN G1
    INSERT INTO evaluations(courseID, profID, quarter, year, numSurveyed, numEnrolled, 
                            courseAsWholeScore, courseContentScore, proContributionScore,
                            proEffectivenessScore)
    VALUES(@C_ID, @P_ID, @quarter, @year, @numSurveyed, @numEnrolled, 
                            @courseAsWholeScore, @courseContentScore, @proContributionScore,
                            @proEffectivenessScore)

END
IF @@ERROR <> 0
ROLLBACK TRAN G1
ELSE 
COMMIT TRAN G1
GO

-- courses table: 
CREATE TABLE courses (
    courseID INT IDENTITY(1, 1) PRIMARY KEY,
    courseNumber INT
)
GO

-- course_professors table: 
CREATE TABLE courses_professors (
    courseProfID INT IDENTITY(1,1) PRIMARY KEY,
    profID INT,
    courseID INT
)
GO

-- professors table:
CREATE TABLE professors (
    profID INT IDENTITY(1,1) PRIMARY KEY,
    firstName VARCHAR(100),
    lastName VARCHAR(100)
)
GO 

-- ratings table: 
CREATE TABLE ratings (
    ratingID INT IDENTITY(1, 1) PRIMARY KEY,
    profID INT,
    courseID INT,
    rating FLOAT,
    comment VARCHAR(350)
)
GO

-- procedure helper for finding the professor based on first and last name
CREATE PROCEDURE find_professor 
    @firstName VARCHAR(100),
    @lastName VARCHAR(100),
    @profID INT OUT
AS 
    SET @profID = (SELECT profID FROM professors WHERE (firstName = @firstName AND lastName = @lastName))
GO 

-- procedure helper for finding the courseID based on courseNumber and courseTitle
CREATE PROCEDURE find_course
    @courseNumber INT,
    @courseID INT OUT
AS
    SET @courseID = (SELECT courseID FROM courses WHERE courseNumber = @courseNumber)
GO

-- procedure for inserting ratings into the ratings table (also takes care of inserting
-- new courses and professors)
CREATE PROCEDURE insertRatings
    @firstName VARCHAR(100),
    @lastName VARCHAR(100),
    @courseNumber INT,
    @rating FLOAT,
    @comment VARCHAR(350)
AS 

BEGIN

SET NOCOUNT ON 

DECLARE @C_ID INT
    EXEC find_course @courseNumber, @courseID = @C_ID out

IF @C_ID IS NULL
    BEGIN
    INSERT INTO courses(courseNumber)
    VALUES (@courseNumber) 
    SELECT @C_ID = SCOPE_IDENTITY()
    END

DECLARE @P_ID INT
    EXEC find_professor @firstName, @lastName, @profID = @P_ID out

IF @P_ID IS NULL
    BEGIN
    INSERT INTO professors(firstName, lastName)
    VALUES (@firstName, @lastName)
    SELECT @P_ID = SCOPE_IDENTITY()
    END

BEGIN TRAN G1
    INSERT INTO ratings(profID, courseID, rating, comment)
    VALUES(@P_ID, @C_ID, @rating, @comment)

END
IF @@ERROR <> 0
ROLLBACK TRAN G1
ELSE 
COMMIT TRAN G1
GO
