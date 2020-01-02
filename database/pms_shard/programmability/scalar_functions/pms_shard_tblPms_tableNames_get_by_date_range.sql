Alter Function pms_shard_tblPms_tableNames_get_by_date_range (@dateFromInclusive datetime, @dateToInclusive datetime)
RETURNS varchar(100)
AS
BEGIN
declare @tableName varchar(100) = (select top(1) tableName from tblHorizontalPartitions order by id desc);
	RETURN @tableName;
END
