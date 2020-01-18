Alter Procedure [dbo].[pms_shards_delete](
	@ids varchar(2000)
)
AS
BEGIN 
	SET NOCOUNT OFF; 
		delete t from tblShards t
		where t.id in (select item from split_string_to_numbers(@ids, ','))
	SET NOCOUNT ON ;
END
