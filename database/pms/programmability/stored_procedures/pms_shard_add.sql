Alter Procedure [dbo].[pms_shard_add](
@hostId int,
@name varchar(128), 
@userIdFromInclusive int,
@userIdToExclusive int
)
AS
BEGIN 
	insert into tblShards (hostId, created, name, userIdFromInclusive, userIdToExclusive) values(@hostId, GETDATE(), @name, @userIdFromInclusive, @userIdToExclusive);
END
